import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Service for managing application-wide filter state.
 * 
 * Provides a reactive stream of filter values that can be subscribed to
 * across components. Filters are merged when updated (partial updates supported).
 */
@Injectable({ providedIn: 'root' })
export class FilterService {
	private filters$: BehaviorSubject<Record<string, string | number>> =
			new BehaviorSubject<Record<string, string | number>>({});

	/**
	 * Updates the filter state by merging new filters with existing ones.
	 * 
	 * @param filters - Key-value pairs of filter criteria to apply/update
	 */
	updateFilter(filters: Record<string, string | number>) {
		const current = this.filters$.value;
		this.filters$.next({
			...current,
			...filters,
		});
	}

	/**
	 * Gets an observable stream of current filter values.
	 * Emits whenever filters are updated via updateFilter().
	 * 
	 * @returns Observable that emits the current filter state
	 */
	getFilters(): Observable<Record<string, string | number>> {
		return this.filters$.asObservable();
	}
}
