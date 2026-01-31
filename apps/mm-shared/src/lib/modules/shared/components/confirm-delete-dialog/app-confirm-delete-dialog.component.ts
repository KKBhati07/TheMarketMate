import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

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

	onCancel() {
		this.dialogRef.close(false);
	}

	onConfirm() {
		this.dialogRef.close(true);
	}
}
