import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { City, Country, State } from '../../../../models/location.model';
import { Subject, takeUntil } from 'rxjs';
import { LocationApiService } from '../../../../services/location.service';
import { fadeSlideIn } from '../../../animations/fade-slide-in.animation';
import { FilterService } from '../../../../services/filter.service';

@Component({
	selector: 'mm-location-selector',
	templateUrl: './location-selector.component.html',
	styleUrls: ['./location-selector.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [fadeSlideIn]
})
export class LocationSelectorComponent implements OnInit, OnDestroy {
	countries: Country[] = [];
	states: State[] = [];
	cities: City[] = [];
	destroy$: Subject<void> = new Subject();

	constructor(
			private locationService: LocationApiService,
			private cdr: ChangeDetectorRef,
			private filterService: FilterService
	) {
	}

	ngOnInit(): void {
		this.getCountries();
	}

	getCountries() {
		this.locationService.getCountries()
				.pipe(takeUntil(this.destroy$))
				.subscribe(res => {
					if (res.isSuccessful()) {
						this.countries = res.body?.data ?? []
						this.cdr.markForCheck();
					}
				})
	}

	getStates(countryId: string) {
		this.locationService.getStates(countryId)
				.pipe(takeUntil(this.destroy$))
				.subscribe(res => {
					if (res.isSuccessful()) {
						this.states = res.body?.data ?? []
					} else {
						this.states = []
					}
					this.cities = [];
					this.cdr.markForCheck();
				})
	}

	getCities(stateId: string) {
		this.locationService.getCities(stateId)
				.pipe(takeUntil(this.destroy$))
				.subscribe(res => {
					if (res.isSuccessful()) {
						this.cities = res.body?.data ?? []
					} else {
						this.cities = [];
					}
					this.cdr.markForCheck();
				})
	}

	onCountrySelected(countryId: string) {
		this.getStates(countryId);
		this.filterService.updateFilter({ country_id: countryId })
	}

	onStateSelected(stateId: string) {
		this.getCities(stateId);
		this.filterService.updateFilter({ state_id: stateId })
	}

	onCitySelected(cityId: string) {
		this.filterService.updateFilter({ city_id: cityId })
	}

	ngOnDestroy() {
		this.destroy$.next();
		this.destroy$.complete();
	}
}