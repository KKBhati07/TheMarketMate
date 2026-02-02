import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	Output,
} from '@angular/core';
import { handleKeyboardActivation } from '@marketmate/shared';

@Component({
	selector: 'mm-filters-component',
	templateUrl: './filters.component.html',
	styleUrls: ['./filters.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class FiltersComponent {

	isExpanded = true;
	@Output() expand: EventEmitter<boolean>
			= new EventEmitter<boolean>();

	toggleFilters() {
		this.isExpanded = !this.isExpanded;
		this.expand.emit(this.isExpanded);
	}

	onToggleKeydown(event: KeyboardEvent) {
		handleKeyboardActivation(() => this.toggleFilters(), event);
	}

}