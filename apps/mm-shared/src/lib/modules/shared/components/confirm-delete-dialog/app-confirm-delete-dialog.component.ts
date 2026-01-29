import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

/**
 * Confirmation dialog component for delete operations.
 * 
 * Displays a confirmation dialog asking the user to confirm a deletion.
 * Returns true if confirmed, false if cancelled.
 */
@Component({
	selector: 'mm-confirm-delete-dialog',
	templateUrl: './app-confirm-delete-dialog.component.html',
	styleUrls: ['./app-confirm-delete-dialog.component.scss']
})
export class AppConfirmDeleteDialogComponent {
	constructor(
			public dialogRef: MatDialogRef<AppConfirmDeleteDialogComponent>,
			@Inject(MAT_DIALOG_DATA) public data: { name: string }
	) {
	}

	/**
	 * Handles cancel button click.
	 * Closes the dialog with false (not confirmed).
	 */
	onCancel(): void {
		this.dialogRef.close(false);
	}

	/**
	 * Handles confirm button click.
	 * Closes the dialog with true (confirmed).
	 */
	onConfirm(): void {
		this.dialogRef.close(true);
	}
}
