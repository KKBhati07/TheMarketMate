import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from "../../../services/auth.service";
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from "@angular/material/bottom-sheet";
import { AppUrls } from "../../../app.urls";
import { Subject, takeUntil } from "rxjs";

@Component({
	selector: 'mm-login-form',
	templateUrl: './login-form.component.html',
	styleUrls: ['./login-form.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginFormComponent implements OnInit, OnDestroy {
	renderComponent = false;
	formHeading = 'Welcome to MM!'
	showPassword = false;
	loginForm: FormGroup;
	invalidEmailText = '';
	isBottomSheet = false
	destroy$: Subject<boolean> = new Subject<boolean>();

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
		this.checkForBottomSheet()
		this.renderComponent = true;
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
		this.authService.loginUser({ email, password })
				.pipe(takeUntil(this.destroy$))
				.subscribe(res => {
					// TODO::Notification Service
					const redirectUrl = this.route.snapshot.queryParamMap.get('redirect');
					this.router.navigateByUrl(redirectUrl || AppUrls.ROOT).then(r => {
						window.location.reload();
					});
				})


	}

	private handleFormValidationError() {

	}

	ngOnDestroy() {
		this.destroy$.next(true);
		this.destroy$.complete();
	}

}
