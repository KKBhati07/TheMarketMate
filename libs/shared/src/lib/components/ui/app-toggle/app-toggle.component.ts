import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { SHARED_UI_DEPS } from '../../../constants/shared-imports';
import { toggleAnimation } from '../../../animations/toggle.animation';

@Component({
	selector: 'mm-toggle',
	templateUrl: './app-toggle.component.html',
	styleUrls: ['./app-toggle.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [...SHARED_UI_DEPS],
	animations: [toggleAnimation]
})
export class AppToggleComponent {
	@Input() checked: boolean = false;
	@Input() disabled: boolean = false;
	@Input() label: string = '';
	@Input() class: string = '';
	@Output() toggleChange = new EventEmitter<boolean>();

	onToggleClick(event: Event) {
		event.stopPropagation();
		if (this.disabled) return;
		this.toggleChange.emit(!this.checked);
	}

	onKeydown(event: KeyboardEvent) {
		if (this.disabled) return;
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			this.toggleChange.emit(!this.checked);
		}
	}
}
