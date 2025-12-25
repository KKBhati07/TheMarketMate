import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FilterService {
	private filters$: BehaviorSubject<Record<string, string | number>> =
			new BehaviorSubject<Record<string, string | number>>({});

	updateFilter(filters: Record<string, string | number>) {
		const current = this.filters$.value;
		this.filters$.next({
			...current,
			...filters,
		});
	}

	getFilters(): Observable<Record<string, string | number>> {
		return this.filters$.asObservable();
	}
}
