import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { ListingService } from '../../../services/listing.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Listing } from 'mm-shared';
import { DeviceDetectorService } from 'mm-shared';
import { FilterService } from 'mm-shared';
import { LoggingService, NotificationService } from 'mm-shared';

@Component({
	selector: 'mm-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {

	destroy$: Subject<void> = new Subject<void>();
	listings: Listing[] = [];
	isExpanded = true;
	isMobile = false;
	render = false;
	currentPage = 0;
	hasMore = true;
	isLoading = false;
	private intersectionObserver?: IntersectionObserver;

	constructor(
			private listingService: ListingService,
			private router: Router,
			private route: ActivatedRoute,
			private cdr: ChangeDetectorRef,
			private deviceDetectorService: DeviceDetectorService,
			private filterService: FilterService,
			private notificationService: NotificationService,
			private logger: LoggingService
	) {
	}

	ngOnInit() {
		this.setIsMobile();
		this.subscribeToRoute();
		this.getFilters();
	}

	ngAfterViewInit() {
		this.setupIntersectionObserver();
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
					const queryParams: Record<string, string | number | boolean> = {};
					params.keys.forEach(key => {
						const value = params.get(key);
						if (value !== null) {
							queryParams[key] = value;
						}
					});
					this.currentPage = 0;
					this.hasMore = true;
					this.getListings(queryParams, 0, false);
				});
	}


	updateQueryParams(queryParams: Record<string, string | number | boolean>) {
		this.router.navigate([], {
			relativeTo: this.route,
			queryParams: queryParams,
			queryParamsHandling: 'merge',
			replaceUrl: true
		}).then(r => null);
	}


	getListings(queryParams: Record<string, string | number | boolean>, page?: number, append: boolean = false) {
		if (this.isLoading) return;

		this.isLoading = true;
		const pageToLoad = page ?? this.currentPage;

		this.listingService.getAll(queryParams, pageToLoad)
				.pipe(takeUntil(this.destroy$))
				.subscribe(res => {
					this.isLoading = false;
					if (res.isSuccessful()) {
						const response = res.body?.data;
						const newItems = response?.items ?? [];

						if (append) {
							this.listings.push(...newItems);
						} else {
							this.listings = newItems;
							this.currentPage = 0;
							setTimeout(() => this.observeSentinel(), 0);
						}

						if (response?.total_pages !== undefined) {
							this.hasMore = (response.current_page ?? pageToLoad) < (response.total_pages - 1);
						} else {
							//Assuming more pages
							this.hasMore = newItems.length > 0;
						}

						if (append) {
							this.currentPage++;
						} else {
							this.currentPage = (response?.current_page ?? 0) + 1;
						}
						this.cdr.markForCheck();
					} else {
						this.logger.warn('Failed to load listings', {
							status: res.status,
							statusText: res.statusText,
							queryParams,
							page: pageToLoad,
						});
						this.notificationService.error({
							message: 'Failed to load listings. Please try again.',
						});
					}
				})

	}

	setupIntersectionObserver() {
		if (typeof IntersectionObserver === 'undefined') {
			// Fallback for browsers that don't support IntersectionObserver
			return;
		}

		this.intersectionObserver = new IntersectionObserver(
				(entries) => {
					entries.forEach(entry => {
						if (entry.isIntersecting && this.hasMore && !this.isLoading && this.listings.length > 0) {
							this.loadNextPage();
						}
					});
				},
				{
					rootMargin: '200px',
					threshold: 0.1
				}
		);

		setTimeout(() => this.observeSentinel(), 0);
	}

	observeSentinel() {
		this.intersectionObserver?.disconnect();
		const sentinel = document.getElementById('listing-sentinel');
		if (sentinel && this.intersectionObserver) {
			this.intersectionObserver.observe(sentinel);
		}
	}

	loadNextPage() {
		if (!this.hasMore || this.isLoading) return;

		const params = this.route.snapshot.queryParamMap;
		const queryParams: Record<string, string | number | boolean> = {};
		params.keys.forEach(key => {
			const value = params.get(key);
			if (value !== null) {
				queryParams[key] = value;
			}
		});
		this.getListings(queryParams, this.currentPage, true);
	}

	trackByListingId(index: number, item: Listing) {
		return item.id;
	}

	toggleFilters(expand: boolean) {
		this.isExpanded = expand;
	}

	ngOnDestroy() {
		if (this.intersectionObserver) {
			this.intersectionObserver.disconnect();
		}
		this.destroy$.next();
		this.destroy$.complete();
	}
}
