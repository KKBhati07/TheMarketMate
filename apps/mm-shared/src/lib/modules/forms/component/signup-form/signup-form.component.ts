import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { AbstractControl, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { PasswordValidator } from "./validator";
import { ErrorText, Signup } from "../../../../models/login-signup.model";
import { AuthService } from "../../../../services/auth.service";
import { AppUrls } from "../../../../common.urls";
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from "@angular/material/bottom-sheet";
import { Subject, takeUntil } from "rxjs";

@Component({
	selector: "mm-signup-form",
	templateUrl: "./signup-form.component.html",
	styleUrls: ["./signup-form.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignupFormComponent implements OnInit, OnDestroy {

	renderComponent = false;
	formHeading = 'Signup to MM!'
	showPassword = false;
	signUpForm: FormGroup;
	step = 1;
	errorText: ErrorText = {}
	isBottomSheet = false;
	destroy$ = new Subject();

	constructor(
			private fb: FormBuilder,
			private router: Router,
			private route: ActivatedRoute,
			private cdr: ChangeDetectorRef,
			private authService: AuthService,
			private bsr: MatBottomSheetRef,
			@Inject(MAT_BOTTOM_SHEET_DATA) public data: { openInBottomSheet: boolean },
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

	onNextClick() {
		if (this.checkForNameEmailValidation(true)) return;
		this.step = 2;
		this.cdr.markForCheck();
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
		if (this.signUpForm.valid) {
			const { name, email, password } = this.signUpForm.value

			const confirmationPass = this.signUpForm.get('confirmPassword')?.value;
			if (password !== confirmationPass) {
				//TODO :: Implement notification service
				// return;
			}
			if (name && email && password) {
				this.authService.signupUser({
					name, email, password
				}).pipe(takeUntil(this.destroy$))
						.subscribe(res => {
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
						})
			}
		} else {
			//TODO :: Implement notification service
		}
	}

	ngOnDestroy() {
		this.destroy$.next(null)
		this.destroy$.complete()
	}
}
