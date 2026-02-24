import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	ElementRef,
	Input,
	OnInit,
	ViewChild,
} from '@angular/core';
import { PriceRange } from '../../../types/common.type';
import { FilterService, SHARED_UI_DEPS } from '@marketmate/shared';
import { MatSlider, MatSliderRangeThumb } from '@angular/material/slider';
import { HeadingComponent } from '../app-heading/heading.component';

@Component({
	selector: 'mm-price-slider',
	templateUrl: './price-slider.component.html',
	styleUrls: ['./price-slider.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [...SHARED_UI_DEPS, MatSlider, MatSliderRangeThumb, HeadingComponent]
})
export class PriceSliderComponent implements OnInit {
	@Input() minValue: number = 0;
	@Input() maxValue: number = 100;
	@Input() step: number = 1;
	priceRange: PriceRange = { min: 0, max: 0 };
	@ViewChild('startInput', { static: false }) startInputRef!: ElementRef<HTMLInputElement>;
	@ViewChild('endInput', { static: false }) endInputRef!: ElementRef<HTMLInputElement>;

	constructor(
			private filterService: FilterService,
			private cdr: ChangeDetectorRef
	) {
	}

	ngOnInit() {
		this.priceRange = { min: this.minValue, max: this.maxValue };
	}

	onSliderInput() {
		const min = Number(this.startInputRef.nativeElement.value);
		const max = Number(this.endInputRef.nativeElement.value);
		this.priceRange.min = min;
		this.priceRange.max = max;
		this.cdr.markForCheck();
	}

	onSliderChange() {
		const min = Number(this.startInputRef.nativeElement.value);
		const max = Number(this.endInputRef.nativeElement.value);
		this.filterService.updateFilter({
			min_price: min,
			max_price: max
		})
	}
}