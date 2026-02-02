import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { handleKeyboardActivation } from '../../../../utils/keyboard.util';

@Component({
	selector: "mm-back-fw-icon",
	templateUrl: "./back-forward-icon.component.html",
	styleUrls: ["./back-forward-icon.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackForwardIconComponent {

	@Input() isForwardIcon = false;
	@Input() containerClass: string = '';
	@Input() iconClass: string = '';
	@Input() backgroundColor: string = '';
	@Input() iconColor: string = 'white';
	@Output() clicked = new EventEmitter<void>();

	onClick() {
		this.clicked.emit();
	}

	onKeydown(event: KeyboardEvent) {
		handleKeyboardActivation(() => this.onClick(), event);
	}

}