import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	EventEmitter,
	Component,
	ElementRef,
	Input,
	Output,
	OnInit,
	ViewChild,
} from '@angular/core';
import { PriceRange } from '../../../../models/common.model';

@Component({
	selector: 'mm-price-slider',
	templateUrl: './price-slider.component.html',
	styleUrls: ['./price-slider.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class PriceSliderComponent implements OnInit {
	@Input() minValue: number = 0;
	@Input() maxValue: number = 100;
	@Input() step: number = 1;
	priceRange: PriceRange = { min: 0, max: 0 };
	@ViewChild('startInput', { static: false }) startInputRef!: ElementRef<HTMLInputElement>;
	@ViewChild('endInput', { static: false }) endInputRef!: ElementRef<HTMLInputElement>;
	@Output() onRangeChange: EventEmitter<PriceRange>
			= new EventEmitter<PriceRange>();

	constructor(private cdr: ChangeDetectorRef) {
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
		this.onRangeChange.emit({ min, max })
	}
}