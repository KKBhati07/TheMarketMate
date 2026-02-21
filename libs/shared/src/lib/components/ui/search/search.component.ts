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

	@Input() set value(v: string) {
		this.searchControl.setValue(v ?? '', { emitEvent: false });
	}

	@Output() valueChange = new EventEmitter<string>();
	@Output() submitted = new EventEmitter<string>();
	@Output() cleared = new EventEmitter<void>();

	searchControl = new FormControl<string>('', { nonNullable: true });
	private destroy$ = new Subject<void>();

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
