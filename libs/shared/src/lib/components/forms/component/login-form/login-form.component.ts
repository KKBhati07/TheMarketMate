import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	ElementRef,
	Inject,
	Input,
	OnDestroy,
	OnInit,
	PLATFORM_ID,
	ViewChild,
	AfterViewInit
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { handleKeyboardActivation } from '../../../../utils/keyboard.util';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from "../../../../services/auth.service";
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from "@angular/material/bottom-sheet";
import { AppUrls } from "../../../../common.urls";
import { Subject, takeUntil } from "rxjs";
import { AppContext } from '../../../../types/common.type';
import { SHARED_UI_DEPS } from '../../../../constants/shared-imports';
import { BottomSheetPillComponent } from '../../../ui/bottomsheet-pill/bottomsheet-pill.component';
import { AppButtonComponent } from '../../../ui/app-button/app-button.component';
import { AppNavButtonComponent } from '../../../ui/app-nav-button/app-nav-button.component';

type LoginMethod = 'PASSWORD' | 'OTP';

@Component({
	selector: 'mm-login-form',
	templateUrl: './login-form.component.html',
	styleUrls: ['./login-form.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [
		...SHARED_UI_DEPS,
		ReactiveFormsModule,
		BottomSheetPillComponent,
		AppButtonComponent,
		AppNavButtonComponent
	]
})
export class LoginFormComponent implements OnInit, AfterViewInit, OnDestroy {

	@ViewChild('emailInput') emailInput!: ElementRef<HTMLInputElement>;
	@ViewChild('otpInput') otpInput!: ElementRef<HTMLInputElement>;
	@Input() iSAdminPortal = false;
	renderComponent = false;
	formHeading = 'Welcome to MM!'
	showPassword = false;
	loginForm: FormGroup;
	invalidEmailText = '';
	isBottomSheet = false
	destroy$: Subject<void> = new Subject<void>();
	isFourOOne = false;
	errorText: string = '';
	isLoading = false;
	loginMethod: LoginMethod = 'PASSWORD';
	otpStep: 1 | 2 = 1;
	otpInfoText = '';

	constructor(
			private fb: FormBuilder,
			private router: Router,
			private route: ActivatedRoute,
			private cdr: ChangeDetectorRef,
			private authService: AuthService,
			@Inject(MAT_BOTTOM_SHEET_DATA) public data: { openInBottomSheet: boolean },
			private bsr: MatBottomSheetRef,
			@Inject(PLATFORM_ID) private platformId: Object
	) {
		this.loginForm = this.fb.group({
			email: ['', [Validators.required, Validators.email]],
			password: ['', Validators.required],
			otp: [''],
		});
	}

	ngOnInit() {
		this.formHeading = this.iSAdminPortal ? 'Admin Login!' : this.formHeading;
		this.loginForm.valueChanges
				.pipe(takeUntil(this.destroy$))
				.subscribe(() => {
					this.resetLoginError();
				});
		this.checkForBottomSheet()
		this.renderComponent = true;
		this.cdr.markForCheck();
	}

	ngAfterViewInit() {
		if (isPlatformBrowser(this.platformId)) {
			setTimeout(() => {
				if (this.emailInput) {
					this.emailInput.nativeElement.focus();
				}
			}, 0);
		}
	}

	private focusOtpInput() {
		if (!isPlatformBrowser(this.platformId)) return;
		setTimeout(() => {
			if (this.otpInput?.nativeElement) {
				this.otpInput.nativeElement.focus();
			}
		}, 0);
	}

	resetLoginError() {
		if (!this.errorText && !this.isFourOOne) return;

		this.errorText = '';
		this.isFourOOne = false;
		this.otpInfoText = '';
		this.cdr.markForCheck();
	}


	private checkForBottomSheet() {
		if (this.data?.openInBottomSheet) {
			this.isBottomSheet = this.data.openInBottomSheet;
		}
	}

	toggleShowPassword() {
		this.showPassword = !this.showPassword;
		this.cdr.markForCheck();
	}

	private applyMethodValidators() {
		const passCtrl = this.loginForm.get('password');
		const otpCtrl = this.loginForm.get('otp');

		if (this.loginMethod === 'PASSWORD') {
			passCtrl?.setValidators([Validators.required]);
			otpCtrl?.clearValidators();
		} else {
			passCtrl?.clearValidators();
			if (this.otpStep === 2) {
				otpCtrl?.setValidators([Validators.required, Validators.minLength(4)]);
			} else {
				otpCtrl?.clearValidators();
			}
		}

		passCtrl?.updateValueAndValidity({ emitEvent: false });
		otpCtrl?.updateValueAndValidity({ emitEvent: false });
	}

	setLoginMethod(method: LoginMethod) {
		if (this.iSAdminPortal) return;
		if (this.loginMethod === method) return;

		this.loginMethod = method;
		this.otpStep = 1;
		this.otpInfoText = '';
		this.resetLoginError();

		this.loginForm.get('password')?.reset('');
		this.loginForm.get('otp')?.reset('');
		this.applyMethodValidators();
		this.cdr.markForCheck();

		if (isPlatformBrowser(this.platformId)) {
			setTimeout(() => this.emailInput?.nativeElement?.focus(), 0);
		}
	}

	onLoginMethodKeydown(method: LoginMethod, event: KeyboardEvent) {
		handleKeyboardActivation(() => this.setLoginMethod(method), event);
	}

	changeOtpEmail() {
		this.otpStep = 1;
		this.loginForm.get('otp')?.reset('');
		this.otpInfoText = '';
		this.resetLoginError();
		this.applyMethodValidators();
		this.cdr.markForCheck();

		if (isPlatformBrowser(this.platformId)) {
			setTimeout(() => this.emailInput?.nativeElement?.focus(), 0);
		}
	}

	onChangeOtpEmailKeydown(event: KeyboardEvent) {
		handleKeyboardActivation(() => this.changeOtpEmail(), event);
	}

	navigateToLoginForm() {
		if (this.isBottomSheet) {
			this.bsr?.dismiss('redirect_to_signup');
		} else {
			this.router.navigate([AppUrls.AUTH.BASE, AppUrls.AUTH.SIGNUP]).then(r => null);
		}
	}

	closeForm() {
		this.loginForm.reset();
		this.router.navigate([AppUrls.ROOT]).then(r => null);
	}

	onCloseKeydown(event: KeyboardEvent) {
		handleKeyboardActivation(() => this.closeForm(), event);
	}

	onTogglePasswordKeydown(event: KeyboardEvent) {
		handleKeyboardActivation(() => this.toggleShowPassword(), event);
	}

	onSignupLinkKeydown(event: KeyboardEvent) {
		handleKeyboardActivation(() => this.navigateToLoginForm(), event);
	}

	getEmailValidation(submitBtnValidations = false) {
		if (submitBtnValidations) {
			const emailInvalid = this.loginForm.get('email')?.hasError('required') ||
					this.loginForm.get('email')?.hasError('email');

			if (this.loginMethod === 'PASSWORD') {
				return emailInvalid || this.loginForm.get('password')?.hasError('required');
			}

			if (this.otpStep === 2) {
				return emailInvalid ||
						this.loginForm.get('otp')?.hasError('required') ||
						this.loginForm.get('otp')?.hasError('minlength');
			}

			return emailInvalid;
		}
		const isEmpty = this.loginForm.get('email')?.hasError('required');
		const isInvalid = this.loginForm.get('email')?.hasError('email');
		if (isEmpty) this.invalidEmailText = 'Email is required';
		else {
			this.invalidEmailText = 'Invalid email';
		}
		this.cdr.markForCheck();
		return this.loginForm.get('email')?.touched && (isEmpty || isInvalid);
	}

	getPassValidation() {
		if (this.loginMethod !== 'PASSWORD') return false;
		return this.loginForm.get('password')?.hasError('required') &&
				this.loginForm.get('password')?.touched
	}

	getOtpValidation() {
		if (this.loginMethod !== 'OTP' || this.otpStep !== 2) return false;
		const ctrl = this.loginForm.get('otp');
		return !!(ctrl?.touched && (ctrl?.hasError('required') || ctrl?.hasError('minlength')));
	}

	onSubmit() {
		if (this.isLoading) return;

		if (this.loginMethod === 'PASSWORD') {
			if (this.loginForm.invalid) {
				this.handleFormValidationError();
				return;
			}
			const { email, password } = this.loginForm.value;
			this.isLoading = true;
			this.cdr.markForCheck();
			this.authService.loginUser({ email, password },
					this.iSAdminPortal ? AppContext.ADMIN : AppContext.PUBLIC)
					.pipe(takeUntil(this.destroy$))
					.subscribe(res => {
						this.isLoading = false;
						if (res.isSuccessful()) {
							const redirectUrl = this.route.snapshot.queryParamMap.get('redirect');
							this.router.navigateByUrl(redirectUrl || AppUrls.ROOT).then(r => {
								if (isPlatformBrowser(this.platformId)) {
									window.location.reload();
								}
							});
						} else {
							if (res.status === 401) {
								this.isFourOOne = true;
								this.errorText = 'Invalid creds! Try again.';
							} else {
								this.errorText = 'Login failed! Try again';
							}
							this.cdr.markForCheck();
						}
					})
			return;
		}

		this.applyMethodValidators();
		if (this.getEmailValidation(true)) {
			this.handleFormValidationError();
			return;
		}

		const email = this.loginForm.get('email')?.value;
		if (this.otpStep === 1) {
			this.isLoading = true;
			this.resetLoginError();
			this.otpInfoText = '';
			this.cdr.markForCheck();
			this.authService.requestLoginOtp(email)
					.pipe(takeUntil(this.destroy$))
					.subscribe(res => {
						this.isLoading = false;
						if (res.isSuccessful()) {
							this.otpStep = 2;
							this.applyMethodValidators();
							this.otpInfoText = 'If your account exists, an OTP has been sent.';
							this.cdr.markForCheck();
							this.focusOtpInput();
						} else {
							this.errorText = 'Failed to send OTP. Try again.';
							this.cdr.markForCheck();
						}
					});
			return;
		}

		if (this.loginForm.get('otp')?.invalid) {
			this.loginForm.get('otp')?.markAsTouched();
			this.cdr.markForCheck();
			return;
		}

		const otp = this.loginForm.get('otp')?.value;
		this.isLoading = true;
		this.resetLoginError();
		this.cdr.markForCheck();
		this.authService.loginWithOtp(email, otp, this.iSAdminPortal ? AppContext.ADMIN : AppContext.PUBLIC)
				.pipe(takeUntil(this.destroy$))
				.subscribe(res => {
					this.isLoading = false;
					if (res.isSuccessful()) {
						const redirectUrl = this.route.snapshot.queryParamMap.get('redirect');
						this.router.navigateByUrl(redirectUrl || AppUrls.ROOT).then(r => {
							if (isPlatformBrowser(this.platformId)) {
								window.location.reload();
							}
						});
					} else {
						if (res.status === 401) {
							this.isFourOOne = true;
							this.errorText = 'Invalid OTP! Try again.';
						} else {
							this.errorText = 'OTP login failed! Try again';
						}
						this.cdr.markForCheck();
					}
				});
	}

	private handleFormValidationError() {

	}

	ngOnDestroy() {
		this.destroy$.next();
		this.destroy$.complete();
	}

}
