import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	Inject,
	Input,
	Output
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SHARED_UI_DEPS } from '../../../constants/shared-imports';
import { CloseBtnComponent } from '../close-btn/close-btn.component';
import { BackForwardIconComponent } from '../back-forward-icon/back-forward-icon.component';

/**
 * Supports dual-mode: standalone component or Material Dialog.
 * Dialog mode is auto-detected via MAT_DIALOG_DATA injection.
 */
@Component({
	selector: 'mm-image-viewer',
	templateUrl: './image-viewer.component.html',
	styleUrls: ['./image-viewer.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [...SHARED_UI_DEPS, CloseBtnComponent, BackForwardIconComponent]
})
export class ImageViewerComponent {
	currentIndex = 0;
	renderFallback = false;
	isDialogOpen = false;
	
	@Input() images: string[] = [];
	
	@Output() close: EventEmitter<void> =
			new EventEmitter<void>();

	constructor(@Inject(MAT_DIALOG_DATA)
							public data: { images: string[] },
							private dialogRef: MatDialogRef<ImageViewerComponent>,
	) {
		if (data) {
			this.images = data.images;
			this.isDialogOpen = true;
		}
	}

	onCloseClick() {
		if (this.isDialogOpen) {
			return this.dialogRef.close();
		}
		return this.close.emit();
	}

	next() {
		if (this.currentIndex < this.images.length - 1) this.currentIndex++;
	}

	prev() {
		if (this.currentIndex > 0) this.currentIndex--;
	}

	get currentImage(): string | null {
		return this.images.length ? this.images[this.currentIndex] : null;
	}
}
