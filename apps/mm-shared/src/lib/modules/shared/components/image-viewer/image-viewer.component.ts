import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	Inject,
	Input,
	OnInit,
	Output
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

/**
 * Image viewer component for displaying images in a gallery/dialog.
 * 
 * Supports navigation between multiple images with next/previous controls.
 * Can be used as a standalone component or within a Material Dialog.
 */
@Component({
	selector: 'mm-image-viewer',
	templateUrl: './image-viewer.component.html',
	styleUrls: ['./image-viewer.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageViewerComponent implements OnInit {
	currentIndex = 0;
	renderFallback = false;
	isDialogOpen = false;
	
	/** Array of image URLs to display */
	@Input() images: string[] = [];
	
	/** Event emitted when the viewer is closed (when not in dialog mode) */
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

	/**
	 * Handles close button click.
	 * Closes dialog if opened as dialog, otherwise emits close event.
	 */
	onCloseClick(): void {
		if (this.isDialogOpen) {
			return this.dialogRef.close();
		}
		return this.close.emit();
	}

	ngOnInit() {

	}

	/**
	 * Navigates to the next image in the gallery.
	 */
	next() {
		if (this.currentIndex < this.images.length - 1) this.currentIndex++;
	}

	/**
	 * Navigates to the previous image in the gallery.
	 */
	prev() {
		if (this.currentIndex > 0) this.currentIndex--;
	}

	/**
	 * Gets the URL of the currently displayed image.
	 * 
	 * @returns Current image URL or null if no images
	 */
	get currentImage(): string | null {
		return this.images.length ? this.images[this.currentIndex] : null;
	}
}
