import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, HostListener, Inject, OnDestroy, OnInit, PLATFORM_ID, AfterViewInit, ViewChild } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { AbstractControl, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { PasswordValidator } from "./validator";
import { ErrorText } from "../../../../models/login-signup.model";
import { AuthService } from "../../../../services/auth.service";
import { AppUrls } from "../../../../common.urls";
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from "@angular/material/bottom-sheet";
import { Subject, takeUntil } from "rxjs";
import { handleKeyboardActivation } from '../../../../utils/keyboard.util';
import { SHARED_UI_DEPS } from '../../../../constants/shared-imports';
import { BottomSheetPillComponent } from '../../../ui/bottomsheet-pill/bottomsheet-pill.component';
import { AppButtonComponent } from '../../../ui/app-button/app-button.component';

@Component({
	selector: "mm-signup-form",
	templateUrl: "./signup-form.component.html",
	styleUrls: ["./signup-form.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [...SHARED_UI_DEPS, ReactiveFormsModule, BottomSheetPillComponent, AppButtonComponent]
})
export class SignupFormComponent implements OnInit, OnDestroy, AfterViewInit {
	@ViewChild('nameInput', { static: false }) nameInput!: ElementRef<HTMLInputElement>;
	@ViewChild('passwordInput', { static: false }) passwordInput!: ElementRef<HTMLInputElement>;

	renderComponent = false;
	formHeading = 'Signup to MM!'
	showPassword = false;
	signUpForm: FormGroup;
	step = 1;
	errorText: ErrorText = {}
	isBottomSheet = false;
	destroy$: Subject<void> = new Subject<void>();
	isLoading = false;

	constructor(
			private fb: FormBuilder,
			private router: Router,
			private route: ActivatedRoute,
			private cdr: ChangeDetectorRef,
			private authService: AuthService,
			private bsr: MatBottomSheetRef,
			@Inject(MAT_BOTTOM_SHEET_DATA) public data: { openInBottomSheet: boolean },
			@Inject(PLATFORM_ID) private platformId: Object
	) {
		this.signUpForm = this.fb.group({
			name: ['', [Validators.required]],
			email: ['', [Validators.required, Validators.email]],
			password: ['', PasswordValidator.validate],
			confirmPassword: ['']
		});
	}

	ngOnInit() {
		this.checkForBottomSheet()
		this.renderComponent = true;
		this.cdr.markForCheck();
	}

	ngAfterViewInit() {
		if (isPlatformBrowser(this.platformId)) {
			setTimeout(() => {
				this.focusFirstInput();
			}, 0);
		}
	}

	private focusFirstInput() {
		if (!isPlatformBrowser(this.platformId)) return;

		setTimeout(() => {
			if (this.step === 1 && this.nameInput?.nativeElement) {
				this.nameInput.nativeElement.focus();
			} else if (this.step === 2 && this.passwordInput?.nativeElement) {
				this.passwordInput.nativeElement.focus();
			}
		}, 0);
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

	closeForm() {
		this.signUpForm.reset();
		this.router.navigate([AppUrls.ROOT]).then(r => null)
	}

	@HostListener('keydown.enter', ['$event'])
	onEnterKeyPress(event: Event) {
		const keyboardEvent = event as KeyboardEvent;
		// handle Enter key on step 1
		if (this.step === 1 && !this.checkForNameEmailValidation(true)) {
			keyboardEvent.preventDefault();
			this.onNextClick();
		}
	}

	onNextClick() {
		if (this.checkForNameEmailValidation(true)) return;
		this.step = 2;
		this.cdr.markForCheck();

		if (isPlatformBrowser(this.platformId)) {
			setTimeout(() => {
				this.focusFirstInput();
			}, 0);
		}
	}

	onBackClick() {
		this.step = 1;
		this.cdr.markForCheck();
		if (isPlatformBrowser(this.platformId)) {
			setTimeout(() => {
				this.focusFirstInput();
			}, 0);
		}
	}

	onBackKeydown(event: KeyboardEvent) {
		handleKeyboardActivation(() => this.onBackClick(), event);
	}

	onCloseKeydown(event: KeyboardEvent) {
		handleKeyboardActivation(() => this.closeForm(), event);
	}

	onNextContainerKeydown(event: KeyboardEvent) {
		handleKeyboardActivation(() => this.onNextClick(), event);
	}

	onTogglePasswordKeydown(event: KeyboardEvent) {
		handleKeyboardActivation(() => this.toggleShowPassword(), event);
	}

	checkForNameEmailValidation(forNextBtn = false, checkFor = 'email'): boolean | undefined {
		if (forNextBtn) {
			return this.signUpForm.get('name')?.hasError('required') ||
					this.signUpForm.get('email')?.hasError('required') ||
					this.signUpForm.get('email')?.hasError('email')
		}
		if (checkFor === 'email') {
			if (this.signUpForm.get('email')?.hasError('required')) {
				this.errorText.email = 'Email is required'
			} else if (this.signUpForm.get('email')?.hasError('email')) {
				this.errorText.email = 'Invalid email!'
			}
			return this.signUpForm.get('email')?.touched &&
					(this.signUpForm.get('email')?.hasError('required') ||
							this.signUpForm.get('email')?.hasError('email'))
		}
		if (checkFor === 'name') {
			this.errorText.name = 'Name is required!'
			return this.signUpForm.get('name')?.touched &&
					(this.signUpForm.get('name')?.hasError('required'))
		}
		return false;

	}

	checkForPasswordValidation(checkConfirmPass = false, checkForSubmitBtn = false): undefined | boolean {


		const passControl: AbstractControl | null = this.signUpForm.get('password')
		const confirmPassControl: AbstractControl | null = this.signUpForm.get('confirmPassword')
		if (checkForSubmitBtn) {
			return !this.signUpForm.valid || passControl?.value !== confirmPassControl?.value
		}
		if (checkConfirmPass) {
			if (confirmPassControl?.touched) {
				if (passControl?.value === confirmPassControl?.value) {
					return false;
				} else {
					this.errorText.confirmPassword = 'Passwords does not match!'
					return true;
				}
			}
			return false;
		}
		if (passControl?.touched) {
			if (passControl?.hasError('required')) {
				this.errorText.password = 'Password is required!'
				return true;
			}
			if (passControl?.hasError('shortPassword')) {
				this.errorText.password = 'Password must be 5 characters long!'
				return true;
			}
			if (passControl?.hasError('noNumber')) {
				this.errorText.password = 'Password must include a number!'
				return true;
			}
		}
		return false;
	}

	onSubmit() {
		if (this.signUpForm.valid && !this.isLoading) {
			const { name, email, password } = this.signUpForm.value

			const confirmationPass = this.signUpForm.get('confirmPassword')?.value;
			if (password !== confirmationPass) {
				//TODO :: Implement notification service
				// return;
			}
			if (name && email && password) {
				this.isLoading = true;
				this.cdr.markForCheck();
				this.authService.signupUser({
					name, email, password
				}).pipe(takeUntil(this.destroy$))
						.subscribe(res => {
							this.isLoading = false;
							if (res.isSuccessful()) {
								const data = res.body?.data;
								if (data) {
									if (data.created) {
										// Notification Service
										this.router.navigate([AppUrls.AUTH.BASE,AppUrls.AUTH.LOGIN]).then(r => null);
									} else if (!data.created && data.already_exists) {
										//Notifiy user
									} else {

									}
								}
							}
							this.cdr.markForCheck();
						})
			}
		} else {
			//TODO :: Implement notification service
		}
	}

	ngOnDestroy() {
		this.destroy$.next();
		this.destroy$.complete();
	}
}
