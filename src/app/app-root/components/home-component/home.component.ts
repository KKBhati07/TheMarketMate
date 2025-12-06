import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { ListingService } from '../../../shared/services/listing.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Listing } from '../../../shared/models/listing.model';
import { DeviceDetectorService } from '../../../app-util/services/device-detector.service';
import { FilterService } from '../../../shared/services/filter.service';

@Component({
	selector: 'mm-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit, OnDestroy {

	destroy$: Subject<void> = new Subject<void>();
	listings: Listing[] = [];
	isExpanded = true;
	isMobile = false;
	render = false;

	constructor(
			private listingService: ListingService,
			private router: Router,
			private route: ActivatedRoute,
			private cdr: ChangeDetectorRef,
			private deviceDetectorService: DeviceDetectorService,
			private filterService: FilterService
	) {
	}

	ngOnInit() {
		this.setIsMobile();
		this.subscribeToRoute();
		this.getFilters();
	}

	setIsMobile() {
		this.deviceDetectorService.isMobile()
				.pipe(takeUntil(this.destroy$))
				.subscribe(isMobile => {
					this.isMobile = isMobile;
					this.render = true;
					this.cdr.markForCheck();
				});
	}

	getFilters() {
		this.filterService.getFilters()
				.pipe(takeUntil(this.destroy$))
				.subscribe(f => {
					this.updateQueryParams(f);
				})
	}

	subscribeToRoute() {
		this.route.queryParamMap
				.pipe(takeUntil(this.destroy$))
				.subscribe(params => {
					const queryParams: Record<string, any> = {};
					params.keys.forEach(key => {
						const value = params.get(key);
						if (value !== null) {
							queryParams[key] = value;
						}
					});
					this.getListings(queryParams);
				});
	}


	updateQueryParams(queryParams: Record<string, any>) {
		this.router.navigate([], {
			relativeTo: this.route,
			queryParams: queryParams,
			queryParamsHandling: 'merge',
			replaceUrl: true
		}).then(r => null);
	}


	getListings(queryParams: Record<string, any>, page?: number, append: boolean = false) {
		this.listingService.getAll(queryParams, page)
				.pipe(takeUntil(this.destroy$))
				.subscribe(res => {
					if (res.isSuccessful()) {
						if (append) {
							this.listings.push(...(res.body?.data.items ?? []))
						} else {
							this.listings = res.body?.data.items ?? []
						}
						this.cdr.markForCheck();
					}
				})

	}

	trackByListingId(index: number, item: Listing) {
		return item.id;
	}

	toggleFilters(expand: boolean) {
		this.isExpanded = expand;
	}

	ngOnDestroy() {
		this.destroy$.next();
		this.destroy$.complete();
	}
}
