import { Component, EventEmitter, Input, Output } from '@angular/core';
import { handleKeyboardActivation } from '../../../../utils/keyboard.util';

@Component({
	selector: 'mm-close-btn',
	templateUrl: './close-btn.component.html',
	styleUrls: ['./close-btn.component.scss']

})
export class CloseBtnComponent {
	@Input() backgroundColor = 'white'
	@Input() containerClass: string = '';
	@Input() iconClass: string = '';
	@Input() iconColor: string = 'var(--primary-color)';
	@Output() clicked = new EventEmitter<void>();

	onClick() {
		this.clicked.emit();
	}

	onKeydown(event: KeyboardEvent) {
		handleKeyboardActivation(() => this.onClick(), event);
	}
}