import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	OnInit,
	Output,
} from '@angular/core';

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

	constructor() {}

	ngOnInit() {
	}


	toggleFilters() {
		this.isExpanded = !this.isExpanded;
		this.expand.emit(this.isExpanded);
	}

}