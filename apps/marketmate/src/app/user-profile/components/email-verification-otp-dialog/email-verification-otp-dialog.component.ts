import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	HostListener,
	Inject,
	OnDestroy
} from '@angular/core';
import {
	MAT_DIALOG_DATA,
	MatDialogRef,
	MatDialogContent,
	MatDialogActions
} from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService, NotificationService } from '@marketmate/shared';
import { SHARED_UI_DEPS, AppButtonComponent, CloseBtnComponent } from '@marketmate/shared';
import { takeUntil } from 'rxjs';
import { Subject } from 'rxjs';

export interface EmailVerificationOtpDialogData {
	email: string;
}

@Component({
	selector: 'mm-email-verification-otp-dialog',
	templateUrl: './email-verification-otp-dialog.component.html',
	styleUrls: ['./email-verification-otp-dialog.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [
		...SHARED_UI_DEPS,
		ReactiveFormsModule,
		MatDialogContent,
		MatDialogActions,
		AppButtonComponent,
		CloseBtnComponent
	]
})
export class EmailVerificationOtpDialogComponent implements OnDestroy {
	otpForm: FormGroup;
	submitting = false;
	private destroy$ = new Subject<void>();

	constructor(
			private fb: FormBuilder,
			private cdr: ChangeDetectorRef,
			private authService: AuthService,
			private notificationService: NotificationService,
			public dialogRef: MatDialogRef<EmailVerificationOtpDialogComponent>,
			@Inject(MAT_DIALOG_DATA) public data: EmailVerificationOtpDialogData
	) {
		this.otpForm = this.fb.group({
			otp: ['', [Validators.required, Validators.minLength(4)]]
		});
	}

	onClose() {
		this.dialogRef.close(false);
	}

	@HostListener('document:keydown', ['$event'])
	onKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			event.preventDefault();
			this.onClose();
		}
	}

	onSubmit() {
		if (this.otpForm.invalid || this.submitting) return;
		const otp = this.otpForm.value.otp?.trim();
		if (!otp || !this.data?.email) return;

		this.submitting = true;
		this.cdr.markForCheck();

		this.authService
				.verifyEmailVerificationOtp(this.data.email, otp)
				.pipe(takeUntil(this.destroy$))
				.subscribe(res => {
					if (res.isSuccessful()) {
						this.notificationService.success({ message: 'Email verified successfully' });
						this.dialogRef.close(true);
					} else {
						this.notificationService.error({ message: res.body?.message ?? 'Verification failed' });
						this.submitting = false;
						this.dialogRef.close(false);
						this.cdr.markForCheck();
					}
				});
	}

	ngOnDestroy() {
		this.destroy$.next();
		this.destroy$.complete();
	}
}
