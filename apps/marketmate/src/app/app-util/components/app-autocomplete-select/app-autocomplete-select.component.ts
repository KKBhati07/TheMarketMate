import {
	Component,
	Input,
	OnInit,
	OnDestroy,
	forwardRef,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Output,
	EventEmitter,
	ElementRef,
	ViewChildren,
	QueryList
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject, takeUntil } from 'rxjs';
import { FormatTextPipe, SHARED_UI_DEPS, dropdownAnimation } from '@marketmate/shared';

@Component({
	selector: 'mm-autocomplete-select',
	templateUrl: './app-autocomplete-select.component.html',
	styleUrls: ['./app-autocomplete-select.component.scss'],
	animations: [dropdownAnimation],
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [...SHARED_UI_DEPS, ReactiveFormsModule, FormatTextPipe],
	providers: [{
		provide: NG_VALUE_ACCESSOR,
		useExisting: forwardRef(() => AutocompleteSelectComponent),
		multi: true
	}]
})
export class AutocompleteSelectComponent<
		T = Record<string, unknown>,
		V extends keyof T = keyof T
> implements OnInit, OnDestroy, ControlValueAccessor {
	@Input('data') set setData(data: T[]) {
		if (data?.length) {
			this.data = data;
			this.filteredData = [...data];
		}
	}

	data: T[] = [];

	@Input() placeholder = 'Select';
	@Input() labelKey: keyof T = 'name' as keyof T;
	@Input() valueKey!: V;
	@Input() disabled = false;
	@Output() valueSelected = new EventEmitter<T[V]>();
	selectedValue: T[V] | null = null;


	searchControl = new FormControl('');
	filteredData: T[] = [];
	isDropdownOpen = false;
	activeIndex = -1;
	destroy$: Subject<void> = new Subject<void>();

	@ViewChildren('optionEl') optionEls!: QueryList<ElementRef<HTMLElement>>;

	private onChange: (value: T[keyof T] | null) => void = () => {};
	private onTouched: () => void = () => {};

	constructor(
			private cdr: ChangeDetectorRef,
			private formatText: FormatTextPipe
	) {
	}

	ngOnInit() {
		this.searchControl.valueChanges
				.pipe(
						debounceTime(500),
						distinctUntilChanged(),
						takeUntil(this.destroy$)
				)
				.subscribe(value => {
					const term = (value || '').toLowerCase();
					this.filteredData = this.data.filter(item =>
							String(item[this.labelKey] ?? '')
									.toLowerCase().includes((value ?? '').toLowerCase())
					);

					if (this.isDropdownOpen) {
						this.resetActiveIndex();
					}
					this.cdr.markForCheck();
				});
	}

	writeValue(value: T[V] | null): void {
		this.selectedValue = value;
		const selectedItem = this.data.find(d => d[this.valueKey] === value);
		if (selectedItem) {
			this.searchControl.setValue(
					this.formatText.transform(
							String(selectedItem[this.labelKey]))
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

	selectItem(item: T) {
		this.selectedValue = item[this.valueKey];
		this.searchControl.setValue(this.formatText.transform(
				String(item[this.labelKey])), { emitEvent: false });
		this.onChange(this.selectedValue);
		this.valueSelected.emit(this.selectedValue);
		this.isDropdownOpen = false;
		this.activeIndex = -1;
		this.cdr.markForCheck();
	}

	toString(value: unknown) {
		return String(value ?? '');
	}


	toggleDropdown() {
		if (this.disabled) return;
		this.isDropdownOpen = !this.isDropdownOpen;
		if (this.isDropdownOpen) {
			this.resetActiveIndex();
		} else {
			this.activeIndex = -1;
		}
		this.cdr.markForCheck();
	}

	onFocus() {
		if (this.disabled) return;
		this.isDropdownOpen = true;
		this.resetActiveIndex();
		this.cdr.markForCheck();
	}

	onInputKeydown(event: KeyboardEvent) {
		if (this.disabled) return;

		if (!this.isDropdownOpen && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
			event.preventDefault();
			this.isDropdownOpen = true;
			this.resetActiveIndex();
			this.cdr.markForCheck();
			return;
		}

		if (!this.isDropdownOpen) return;

		switch (event.key) {
			case 'ArrowDown': {
				event.preventDefault();
				if (!this.filteredData.length) return;
				const next = this.activeIndex < 0 ? 0 : Math.min(this.activeIndex + 1, this.filteredData.length - 1);
				this.setActiveIndex(next);
				return;
			}
			case 'ArrowUp': {
				event.preventDefault();
				if (!this.filteredData.length) return;
				const next = this.activeIndex < 0 ? this.filteredData.length - 1 : Math.max(this.activeIndex - 1, 0);
				this.setActiveIndex(next);
				return;
			}
			case 'Enter': {
				if (!this.filteredData.length) return;
				event.preventDefault();
				const idx = this.activeIndex < 0 ? 0 : this.activeIndex;
				const item = this.filteredData[idx];
				if (item) {
					this.selectItem(item);
				}
				return;
			}
			case 'Escape': {
				event.preventDefault();
				this.isDropdownOpen = false;
				this.activeIndex = -1;
				this.cdr.markForCheck();
				return;
			}
		}
	}

	onOptionMouseEnter(index: number) {
		this.activeIndex = index;
		this.cdr.markForCheck();
	}

	private resetActiveIndex() {
		if (!this.filteredData.length) {
			this.activeIndex = -1;
			return;
		}

		const selectedIdx = this.selectedValue == null
				? -1
				: this.filteredData.findIndex(i => i[this.valueKey] === this.selectedValue);

		this.activeIndex = selectedIdx >= 0 ? selectedIdx : 0;
		this.ensureActiveVisible();
	}

	private setActiveIndex(index: number) {
		this.activeIndex = index;
		this.cdr.markForCheck();
		this.ensureActiveVisible();
	}

	private ensureActiveVisible() {
		const index = this.activeIndex;
		if (index < 0) return;

		// wait for view to reflect active class + option list
		setTimeout(() => {
			const el = this.optionEls?.get(index)?.nativeElement;
			el?.scrollIntoView({ block: 'nearest' });
		}, 0);
	}

	handleBlur() {
		setTimeout(() => {
			this.isDropdownOpen = false
			this.activeIndex = -1;
			this.cdr.markForCheck();
		}, 200);
		this.onTouched();
	}

	ngOnDestroy() {
		this.destroy$.next();
		this.destroy$.complete();
	}

}