import {
	Component,
	Input,
	OnInit,
	forwardRef,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Output, EventEmitter
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { FormatTextPipe } from 'mm-shared';
import { dropdownAnimation } from 'mm-shared';

@Component({
	selector: 'mm-autocomplete-select',
	templateUrl: './app-autocomplete-select.component.html',
	styleUrls: ['./app-autocomplete-select.component.scss'],
	animations: [dropdownAnimation],
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [{
		provide: NG_VALUE_ACCESSOR,
		useExisting: forwardRef(() => AutocompleteSelectComponent),
		multi: true
	}]
})
export class AutocompleteSelectComponent implements OnInit, ControlValueAccessor {
	@Input('data') set setData(data: any[]) {
		if (data?.length) {
			this.data = data;
			this.filteredData = [...data];
		}
	}

	data: any[] = [];

	@Input() placeholder = 'Select';
	@Input() labelKey = 'name';
	@Input() valueKey = 'id';
	@Input() disabled = false;
	@Output() valueSelected = new EventEmitter<any>();


	searchControl = new FormControl('');
	filteredData: any[] = [];
	selectedValue: any = null;
	isDropdownOpen = false;

	private onChange: any = () => {
	};
	private onTouched: any = () => {
	};

	constructor(
			private cdr: ChangeDetectorRef,
			private formatText: FormatTextPipe
	) {
	}

	ngOnInit() {
		this.searchControl.valueChanges
				.pipe(debounceTime(500), distinctUntilChanged())
				.subscribe(value => {
					const term = (value || '').toLowerCase();
					this.filteredData = this.data.filter(item =>
							(item[this.labelKey] ?? '')
									.toLowerCase().includes((value ?? '').toLowerCase())
					);
					this.cdr.markForCheck();
				});
	}

	writeValue(value: any): void {
		this.selectedValue = value;
		const selectedItem = this.data.find(d => d[this.valueKey] === value);
		if (selectedItem) {
			this.searchControl.setValue(
					this.formatText.transform(
							selectedItem[this.labelKey])
					, { emitEvent: false });
		} else {
			this.searchControl.setValue('', { emitEvent: false });
		}
	}

	registerOnChange(fn: any): void {
		this.onChange = fn;
	}

	registerOnTouched(fn: any): void {
		this.onTouched = fn;
	}

	setDisabledState(isDisabled: boolean): void {
		this.disabled = isDisabled;
		if (isDisabled) this.searchControl.disable({ emitEvent: false });
		else this.searchControl.enable({ emitEvent: false });
	}

	selectItem(item: any) {
		this.selectedValue = item[this.valueKey];
		this.searchControl.setValue(this.formatText.transform(
				item[this.labelKey]), { emitEvent: false });
		this.onChange(this.selectedValue);
		this.valueSelected.emit(this.selectedValue);
		this.isDropdownOpen = false;
	}

	toggleDropdown() {
		if (this.disabled) return;
		this.isDropdownOpen = !this.isDropdownOpen;
	}

	handleBlur() {
		setTimeout(() => {
			this.isDropdownOpen = false
			this.cdr.markForCheck();
		}, 200);
		this.onTouched();
	}
}