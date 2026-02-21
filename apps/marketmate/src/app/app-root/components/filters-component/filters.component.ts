import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	Inject,
	Output,
} from '@angular/core';
import {
	handleKeyboardActivation, SHARED_UI_DEPS, BackForwardIconComponent, BottomSheetPillComponent,
	CloseBtnComponent
} from '@marketmate/shared';
import { PriceSliderComponent } from '../../../app-util/components/price-slider/price-slider.component';
import { LocationSelectorComponent } from '../../../app-util/components/location-selector/location-selector.component';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { HeadingComponent } from '../../../app-util/components/app-heading/heading.component';

@Component({
	selector: 'mm-filters-component',
	templateUrl: './filters.component.html',
	styleUrls: ['./filters.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [
		...SHARED_UI_DEPS,
		PriceSliderComponent,
		LocationSelectorComponent,
		BackForwardIconComponent,
		BottomSheetPillComponent,
		HeadingComponent,
		CloseBtnComponent
	]
})
export class FiltersComponent {

	isExpanded = true;
	isBottomSheet = false;
	@Output() expand: EventEmitter<boolean>
			= new EventEmitter<boolean>();

	constructor(
			@Inject(MAT_BOTTOM_SHEET_DATA) public data: { isBottomSheet?: boolean } | null,
			private bsr: MatBottomSheetRef<FiltersComponent>,
	) {
		this.isBottomSheet = !!this.data?.isBottomSheet;
		if (this.isBottomSheet) {
			this.isExpanded = true;
		}
	}

	toggleFilters() {
		if (this.isBottomSheet) return;
		this.isExpanded = !this.isExpanded;
		this.expand.emit(this.isExpanded);
	}

	onToggleKeydown(event: KeyboardEvent) {
		handleKeyboardActivation(() => this.toggleFilters(), event);
	}

	closeBottomSheet() {
		if (!this.isBottomSheet) return;
		this.bsr?.dismiss();
	}

}