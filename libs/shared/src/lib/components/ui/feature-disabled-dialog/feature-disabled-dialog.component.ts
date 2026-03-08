import { Component, Inject } from '@angular/core';
import {
	MatDialogRef,
	MAT_DIALOG_DATA,
	MatDialogContent,
	MatDialogActions
} from '@angular/material/dialog';
import { SHARED_UI_DEPS } from '../../../constants/shared-imports';
import { AppButtonComponent } from '../app-button/app-button.component';
import { HeadingComponent } from '../app-heading/heading.component';
import { CloseBtnComponent } from '../close-btn/close-btn.component';

export interface FeatureDisabledDialogData {
	message?: string;
}

@Component({
	selector: 'mm-feature-disabled-dialog',
	templateUrl: './feature-disabled-dialog.component.html',
	styleUrls: ['./feature-disabled-dialog.component.scss'],
	standalone: true,
	imports: [
		...SHARED_UI_DEPS,
		MatDialogContent,
		MatDialogActions,
		AppButtonComponent,
		HeadingComponent,
		CloseBtnComponent
	]
})
export class FeatureDisabledDialogComponent {
	message: string;
	protected readonly FEATURE_DISABLED_DEFAULT_MESSAGE =
			'This feature is temporarily disabled. It will be enabled soon.';

	constructor(
			public dialogRef: MatDialogRef<FeatureDisabledDialogComponent>,
			@Inject(MAT_DIALOG_DATA) public data: FeatureDisabledDialogData | null
	) {
		this.message = data?.message ?? this.FEATURE_DISABLED_DEFAULT_MESSAGE;
	}

	close() {
		this.dialogRef.close();
	}

	understood() {
		this.dialogRef.close();
	}
}
