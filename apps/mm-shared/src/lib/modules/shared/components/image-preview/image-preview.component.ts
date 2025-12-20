import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
	selector: 'mm-image-preview',
	templateUrl: 'image-preview.component.html',
	styleUrls: ['image-preview.component.scss']
})
export class ImagePreviewComponent {

	renderTemplate = false;
	@Input() iconClass: string = '';
	@Input() imgClass: string = '';
	@Input() imageUrl: string = '';
	@Input() showRemoveIcon: boolean = true;
	@Output() removeImage: EventEmitter<void> = new EventEmitter();


}