import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { City, Country, State, SHARED_UI_DEPS, fadeSlideIn } from '@marketmate/shared';
import { Subject, takeUntil } from 'rxjs';
import { LocationApiService } from '../../../../services/location.service';
import { FilterService } from '@marketmate/shared';
import { LoggingService, NotificationService } from '@marketmate/shared';
import { AutocompleteSelectComponent } from '../app-autocomplete-select/app-autocomplete-select.component';
import { HeadingComponent } from '../product-category/app-heading/heading.component';

@Component({
	selector: 'mm-location-selector',
	templateUrl: './location-selector.component.html',
	styleUrls: ['./location-selector.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [fadeSlideIn],
	standalone: true,
	imports: [...SHARED_UI_DEPS, AutocompleteSelectComponent, HeadingComponent]
})
export class LocationSelectorComponent implements OnInit, OnDestroy {
	countries: Country[] = [];
	states: State[] = [];
	cities: City[] = [];
	destroy$: Subject<void> = new Subject<void>();

	constructor(
			private locationService: LocationApiService,
			private cdr: ChangeDetectorRef,
			private filterService: FilterService,
			private notificationService: NotificationService,
			private logger: LoggingService,
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
					} else {
						this.logger.warn('Failed to load countries', { status: res.status, statusText: res.statusText });
						this.notificationService.error({ message: 'Failed to load locations. Please try again.' });
					}
				})
	}

	getStates(countryId: number) {
		this.locationService.getStates(countryId)
				.pipe(takeUntil(this.destroy$))
				.subscribe(res => {
					if (res.isSuccessful()) {
						this.states = res.body?.data ?? []
					} else {
						this.states = []
						this.logger.warn('Failed to load states', { countryId, status: res.status, statusText: res.statusText });
						this.notificationService.error({ message: 'Failed to load states. Please try again.' });
					}
					this.cities = [];
					this.cdr.markForCheck();
				})
	}

	getCities(stateId: number) {
		this.locationService.getCities(stateId)
				.pipe(takeUntil(this.destroy$))
				.subscribe(res => {
					if (res.isSuccessful()) {
						this.cities = res.body?.data ?? []
					} else {
						this.cities = [];
						this.logger.warn('Failed to load cities', { stateId, status: res.status, statusText: res.statusText });
						this.notificationService.error({ message: 'Failed to load cities. Please try again.' });
					}
					this.cdr.markForCheck();
				})
	}

	onCountrySelected(countryId: number) {
		this.getStates(countryId);
		this.filterService.updateFilter({ country_id: countryId })
	}

	onStateSelected(stateId: number) {
		this.getCities(stateId);
		this.filterService.updateFilter({ state_id: stateId })
	}

	onCitySelected(cityId: number) {
		this.filterService.updateFilter({ city_id: cityId })
	}

	ngOnDestroy() {
		this.destroy$.next();
		this.destroy$.complete();
	}
}