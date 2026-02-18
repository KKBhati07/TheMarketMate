import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AppButtonComponent, CloseBtnComponent, handleKeyboardActivation, SHARED_UI_DEPS } from '@marketmate/shared';

export type ContactMethod = 'EMAIL' | 'CHAT';

export interface ContactOptionsDialogData {
	listingTitle?: string;
	sellerName?: string;
}

@Component({
	selector: 'mm-contact-options-dialog',
	standalone: true,
	imports: [...SHARED_UI_DEPS, AppButtonComponent, CloseBtnComponent],
	templateUrl: './contact-options-dialog.component.html',
	styleUrls: ['./contact-options-dialog.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactOptionsDialogComponent {
	constructor(
			private readonly dialogRef: MatDialogRef<ContactOptionsDialogComponent, ContactMethod | null>,
			@Inject(MAT_DIALOG_DATA) public readonly data: ContactOptionsDialogData,
	) {
	}

	close(): void {
		this.dialogRef.close(null);
	}

	select(method: ContactMethod): void {
		this.dialogRef.close(method);
	}

	onOptionKeydown(event: KeyboardEvent, method: ContactMethod) {
		handleKeyboardActivation(() => this.select(method), event);
	}
}
