import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
	selector: 'mm-image-upload-icon',
	templateUrl: 'image-upload-icon.component.html',
	styleUrls: ['image-upload-icon.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageUploadIconComponent {

	@Input() class = '';
	@Input() iconClass = '';

	@Output() onImageSelect: EventEmitter<FileList>
			= new EventEmitter<FileList>();

	constructor() {
	}

	imageSelectClick(event: Event): void {
		const input = event.target as HTMLInputElement;
		this.onImageSelect.emit(input?.files ?? undefined)
		input.value = '';
	}
}