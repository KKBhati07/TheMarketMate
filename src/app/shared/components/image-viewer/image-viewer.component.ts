import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
	selector: 'mm-image-viewer',
	templateUrl: './image-viewer.component.html',
	styleUrls: ['./image-viewer.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageViewerComponent implements OnInit {
	currentIndex = 0;
	renderFallback = false;
	@Input() images: string[] = [];
	@Output() close: EventEmitter<void> =
			new EventEmitter<void>();


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
