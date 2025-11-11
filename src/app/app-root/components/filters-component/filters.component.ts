import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	OnInit,
	Output,
} from '@angular/core';
import { PriceRange } from '../../../models/common.model';

@Component({
	selector: 'mm-filters-component',
	templateUrl: './filters.component.html',
	styleUrls: ['./filters.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class FiltersComponent implements OnInit {

	isExpanded = true;
	@Output() expand: EventEmitter<boolean>
			= new EventEmitter<boolean>();
	@Output() onPriceRangeChange: EventEmitter<PriceRange>
			= new EventEmitter<PriceRange>();

	constructor() {}

	ngOnInit() {
	}


	toggleFilters() {
		this.isExpanded = !this.isExpanded;
		this.expand.emit(this.isExpanded);
	}

}