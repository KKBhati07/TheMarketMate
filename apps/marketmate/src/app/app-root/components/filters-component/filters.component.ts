import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	Output,
} from '@angular/core';
import { handleKeyboardActivation, SHARED_UI_DEPS, BackForwardIconComponent } from '@marketmate/shared';
import { PriceSliderComponent } from '../../../app-util/components/price-slider/price-slider.component';
import { LocationSelectorComponent } from '../../../app-util/components/location-selector/location-selector.component';

@Component({
	selector: 'mm-filters-component',
	templateUrl: './filters.component.html',
	styleUrls: ['./filters.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [...SHARED_UI_DEPS, PriceSliderComponent, LocationSelectorComponent, BackForwardIconComponent]
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