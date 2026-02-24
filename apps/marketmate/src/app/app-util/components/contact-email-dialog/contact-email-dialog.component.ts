import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AppButtonComponent, CloseBtnComponent, SHARED_UI_DEPS } from '@marketmate/shared';
import { CONSTANTS } from '../../../app.constants';

export interface ContactEmailDialogData {
	listingTitle?: string;
	sellerName?: string;
	currentUrl?: string;
}

export interface ContactEmailDraft {
	subject: string;
	body: string;
}

@Component({
	selector: 'mm-contact-email-dialog',
	standalone: true,
	imports: [...SHARED_UI_DEPS,
		ReactiveFormsModule,
		AppButtonComponent,
		CloseBtnComponent,
	],
	templateUrl: './contact-email-dialog.component.html',
	styleUrls: ['./contact-email-dialog.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactEmailDialogComponent {
	form: FormGroup;

	readonly SUBJECT_MAX = CONSTANTS.EMAIL.SUBJECT_MAX;
	readonly BODY_MAX = CONSTANTS.EMAIL.BODY_MAX;

	constructor(
			private readonly fb: FormBuilder,
			private readonly dialogRef: MatDialogRef<ContactEmailDialogComponent, ContactEmailDraft | null>,
			@Inject(MAT_DIALOG_DATA) public readonly data: ContactEmailDialogData,
	) {
		const listingTitle = (data?.listingTitle ?? '').trim();
		const sellerName = (data?.sellerName ?? '').trim();

		const subject = listingTitle
				? `MarketMate: Interested in ${ listingTitle }`
				: 'MarketMate: Interested in one of your posts';

		const greetingName = sellerName || 'there';
		const bodyLines = [
			`Hi ${ greetingName },`,
			'',
			listingTitle
					? `I am interested in your post ${ listingTitle }. Is it still available?`
					: `I am interested in your post. Is it still available?`,
			'',
			'Thanks,',
		].filter(Boolean);

		this.form = this.fb.group({
			subject: [subject, [Validators.required, Validators.maxLength(this.SUBJECT_MAX)]],
			body: [bodyLines.join('\n'), [Validators.required, Validators.maxLength(this.BODY_MAX)]],
		});
	}

	close(): void {
		this.dialogRef.close(null);
	}

	send(): void {
		if (this.form.invalid) {
			this.form.markAllAsTouched();
			return;
		}

		const subject = String(this.form.value.subject ?? '').trim();
		const body = String(this.form.value.body ?? '').trim();
		this.dialogRef.close({ subject, body });
	}

	get subjectRemaining(): number {
		const v = String(this.form.value.subject ?? '');
		return this.SUBJECT_MAX - v.length;
	}

	get bodyRemaining(): number {
		const v = String(this.form.value.body ?? '');
		return this.BODY_MAX - v.length;
	}

	isSubjectRequiredInvalid(): boolean {
		const c = this.form.get('subject');
		return !!(c?.touched && c?.hasError('required'));
	}

	isBodyRequiredInvalid(): boolean {
		const c = this.form.get('body');
		return !!(c?.touched && c?.hasError('required'));
	}
}

