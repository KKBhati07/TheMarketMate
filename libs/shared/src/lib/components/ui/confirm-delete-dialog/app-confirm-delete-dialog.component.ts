import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { SHARED_UI_DEPS } from '../../../constants/shared-imports';
import { AppNavButtonComponent } from '../app-nav-button/app-nav-button.component';

@Component({
	selector: 'mm-confirm-delete-dialog',
	templateUrl: './app-confirm-delete-dialog.component.html',
	styleUrls: ['./app-confirm-delete-dialog.component.scss'],
	standalone: true,
	imports: [...SHARED_UI_DEPS, MatDialogContent, MatDialogActions, AppNavButtonComponent]
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
