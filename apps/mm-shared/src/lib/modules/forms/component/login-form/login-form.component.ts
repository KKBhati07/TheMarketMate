import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from "../../../../services/auth.service";
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from "@angular/material/bottom-sheet";
import { AppUrls } from "../../../../common.urls";
import { Subject, takeUntil } from "rxjs";
import { CONSTANTS } from '../../../../app.constants';
import { AppContext } from '../../../../types/common.type';

@Component({
	selector: 'mm-login-form',
	templateUrl: './login-form.component.html',
	styleUrls: ['./login-form.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginFormComponent implements OnInit, OnDestroy {
	@Input() iSAdminPortal = false;
	renderComponent = false;
	formHeading = 'Welcome to MM!'
	showPassword = false;
	loginForm: FormGroup;
	invalidEmailText = '';
	isBottomSheet = false
	destroy$: Subject<boolean> = new Subject<boolean>();
	isFourOOne = false;
	errorText: string = '';

	constructor(
			private fb: FormBuilder,
			private router: Router,
			private route: ActivatedRoute,
			private cdr: ChangeDetectorRef,
			private authService: AuthService,
			@Inject(MAT_BOTTOM_SHEET_DATA) public data: { openInBottomSheet: boolean },
			private bsr: MatBottomSheetRef
	) {
		this.loginForm = this.fb.group({
			email: ['', [Validators.required, Validators.email]],
			password: ['', Validators.required],
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

	resetLoginError(): void {
		if (!this.errorText && !this.isFourOOne) return;

		this.errorText = '';
		this.isFourOOne = false;
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

	navigateToLoginForm() {
		if (this.isBottomSheet) {
			this.bsr?.dismiss('redirect_to_signup');
		} else {
			this.router.navigate(AppUrls.AUTH.SIGNUP.split('/')).then(r => null);
		}
	}

	closeForm() {
		this.loginForm.reset();
		this.router.navigate([AppUrls.ROOT]).then(r => null);
	}

	getEmailValidation(submitBtnValidations = false) {
		if (submitBtnValidations) {
			return this.loginForm.get('email')?.hasError('required') ||
					this.loginForm.get('email')?.hasError('email') ||
					this.loginForm.get('password')?.hasError('required')
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
		return this.loginForm.get('password')?.hasError('required') &&
				this.loginForm.get('password')?.touched
	}

	onSubmit() {
		if (this.loginForm.invalid) {
			this.handleFormValidationError();
			return;
		}
		const { email, password } = this.loginForm.value;
		this.authService.loginUser({ email, password },
				(this.iSAdminPortal ? CONSTANTS.APP_CONTEXT.ADMIN : CONSTANTS.APP_CONTEXT.PUBLIC) as AppContext)
				.pipe(takeUntil(this.destroy$))
				.subscribe(res => {
					if (res.isSuccessful()) {
						const redirectUrl = this.route.snapshot.queryParamMap.get('redirect');
						this.router.navigateByUrl(redirectUrl || AppUrls.ROOT).then(r => {
							window.location.reload();
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
	}

	private handleFormValidationError() {

	}

	ngOnDestroy() {
		this.destroy$.next(true);
		this.destroy$.complete();
	}

}
