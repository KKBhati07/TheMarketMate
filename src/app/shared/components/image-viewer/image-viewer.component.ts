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

	onCloseClick(): void {
		if (this.isDialogOpen) {
			return this.dialogRef.close();
		}
		return this.close.emit();
	}


	ngOnInit() {

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
