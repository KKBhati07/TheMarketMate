import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject, takeUntil } from 'rxjs';
import { SHARED_UI_DEPS } from '../../../constants/shared-imports';

@Component({
	selector: 'mm-search',
	templateUrl: './search.component.html',
	styleUrls: ['./search.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [...SHARED_UI_DEPS, ReactiveFormsModule],
})
export class SearchComponent implements OnInit, OnDestroy {
	@Input() placeholder = 'Search';
	@Input() disabled = false;
	@Input() debounceMs = 350;
	@Input() showSuggestions = true;
	@Input() minCharsForSuggestions = 2;

	@Input() set value(v: string) {
		this.searchControl.setValue(v ?? '', { emitEvent: false });
	}

	@Input() set suggestions(value: string[]) {
		this._suggestions = Array.isArray(value) ? value : [];
		this.activeIndex = this._suggestions.length ? 0 : -1;
	}
	get suggestions(): string[] {
		return this._suggestions;
	}
	private _suggestions: string[] = [];

	@Output() valueChange = new EventEmitter<string>();
	@Output() submitted = new EventEmitter<string>();
	@Output() cleared = new EventEmitter<void>();
	@Output() suggestionSelected = new EventEmitter<string>();

	searchControl = new FormControl<string>('', { nonNullable: true });
	private destroy$ = new Subject<void>();
	activeIndex = -1;
	isFocused = false;

	ngOnInit() {
		this.searchControl.valueChanges
				.pipe(
						debounceTime(this.debounceMs),
						distinctUntilChanged(),
						takeUntil(this.destroy$)
				)
				.subscribe(val => {
					this.valueChange.emit((val ?? '').toString());
				});
	}

	get isDropdownOpen(): boolean {
		const v = (this.searchControl.value ?? '').trim();
		return this.showSuggestions
				&& this.isFocused
				&& !this.disabled
				&& v.length >= this.minCharsForSuggestions
				&& this._suggestions.length > 0;
	}

	onFocus() {
		this.isFocused = true;
	}

	onBlur() {
		setTimeout(() => {
			this.isFocused = false;
		}, 150);
	}

	onKeydown(event: KeyboardEvent) {
		if (this.disabled) return;

		if (!this.isDropdownOpen) {
			if (event.key === 'Enter') {
				event.preventDefault();
				this.onSubmit();
			}
			return;
		}

		switch (event.key) {
			case 'ArrowDown': {
				event.preventDefault();
				this.activeIndex = Math.min(this.activeIndex + 1, this._suggestions.length - 1);
				return;
			}
			case 'ArrowUp': {
				event.preventDefault();
				this.activeIndex = Math.max(this.activeIndex - 1, 0);
				return;
			}
			case 'Enter': {
				event.preventDefault();
				const idx = this.activeIndex < 0 ? 0 : this.activeIndex;
				const value = this._suggestions[idx];
				if (value) {
					this.selectSuggestion(value);
				} else {
					this.onSubmit();
				}
				return;
			}
			case 'Escape': {
				event.preventDefault();
				this.isFocused = false;
				return;
			}
		}
	}

	onSuggestionMouseEnter(index: number) {
		this.activeIndex = index;
	}

	selectSuggestion(value: string) {
		const v = (value ?? '').toString();
		this.searchControl.setValue(v, { emitEvent: false });
		this.suggestionSelected.emit(v);
		this.isFocused = false;
	}

	onSubmit() {
		if (this.disabled) return;
		this.submitted.emit(this.searchControl.value);
	}

	onClear() {
		if (this.disabled) return;
		this.searchControl.setValue('', { emitEvent: true });
		this.cleared.emit();
	}

	ngOnDestroy() {
		this.destroy$.next();
		this.destroy$.complete();
	}
}
