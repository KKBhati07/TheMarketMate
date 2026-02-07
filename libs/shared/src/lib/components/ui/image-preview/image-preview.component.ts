import { Component, EventEmitter, Input, Output } from '@angular/core';
import { handleKeyboardActivation } from '../../../utils/keyboard.util';
import { SHARED_UI_DEPS } from '../../../constants/shared-imports';

@Component({
	selector: 'mm-image-preview',
	templateUrl: 'image-preview.component.html',
	styleUrls: ['image-preview.component.scss'],
	standalone: true,
	imports: [...SHARED_UI_DEPS]
})
export class ImagePreviewComponent {

	renderTemplate = false;
	@Input() iconClass: string = '';
	@Input() imgClass: string = '';
	@Input() imageUrl: string = '';
	@Input() showRemoveIcon: boolean = true;
	@Output() removeImage: EventEmitter<void> = new EventEmitter();

	onRemoveKeydown(event: KeyboardEvent) {
		handleKeyboardActivation(() => this.removeImage.emit(), event);
	}

}