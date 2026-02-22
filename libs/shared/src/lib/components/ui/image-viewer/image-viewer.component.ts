import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	HostListener,
	Inject,
	Input,
	Optional,
	Output
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SHARED_UI_DEPS } from '../../../constants/shared-imports';
import { CloseBtnComponent } from '../close-btn/close-btn.component';
import { BackForwardIconComponent } from '../back-forward-icon/back-forward-icon.component';
import { viewerBackdropAnimation, viewerContentAnimation } from '../../../animations/viewer-backdrop.animation';

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
	imports: [...SHARED_UI_DEPS, CloseBtnComponent, BackForwardIconComponent],
	animations: [
		viewerBackdropAnimation,
		viewerContentAnimation,
	],
})
export class ImageViewerComponent {
	currentIndex = 0;
	renderFallback = false;
	isDialogOpen = false;
	isClosing = false;
	animationState: 'open' | 'close' = 'open';
	private readonly closeAnimationMs = 170;

	@Input() images: string[] = [];

	@Input() set startIndex(index: number) {
		this.setIndex(index);
	}

	@Output() close: EventEmitter<void> =
			new EventEmitter<void>();

	constructor(
			@Optional() @Inject(MAT_DIALOG_DATA)
			public data: { images: string[]; startIndex?: number } | null,
			@Optional() private dialogRef: MatDialogRef<ImageViewerComponent> | null,
	) {
		if (data) {
			this.images = data.images;
			if (typeof data.startIndex === 'number') {
				this.setIndex(data.startIndex);
			}
			this.isDialogOpen = true;
			if (this.dialogRef) {
				// Prevent abrupt ESC close so we can animate out.
				this.dialogRef.disableClose = true;
			}
		}
	}

	onCloseClick() {
		this.beginClose();
	}

	next() {
		if (this.currentIndex < this.images.length - 1) {
			this.currentIndex++;
			this.renderFallback = false;
		}
	}

	prev() {
		if (this.currentIndex > 0) {
			this.currentIndex--;
			this.renderFallback = false;
		}
	}

	get currentImage(): string | null {
		return this.images.length ? this.images[this.currentIndex] : null;
	}

	@HostListener('document:keydown', ['$event'])
	onDocumentKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			event.preventDefault();
			this.beginClose();
			return;
		}
		if (event.key === 'ArrowRight') {
			this.next();
			return;
		}
		if (event.key === 'ArrowLeft') {
			this.prev();
			return;
		}
	}

	private beginClose() {
		if (this.isClosing) return;
		this.isClosing = true;
		this.animationState = 'close';

		setTimeout(() => {
			if (this.isDialogOpen && this.dialogRef) {
				this.dialogRef.close();
			} else {
				this.close.emit();
			}
		}, this.closeAnimationMs);
	}

	private setIndex(index: number) {
		if (!Number.isFinite(index)) return;
		const max = Math.max(0, this.images.length - 1);
		this.currentIndex = Math.min(Math.max(0, Math.floor(index)), max);
		this.renderFallback = false;
	}
}
