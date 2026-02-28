import {
	AfterViewInit,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	Inject,
	OnDestroy,
	OnInit,
	PLATFORM_ID
} from "@angular/core";
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { ListingService } from '../../../services/listing.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import {
	Listing,
	SHARED_UI_DEPS,
	ListingCardComponent,
	ListingCardSkeletonComponent,
	EmptyStateComponent,
	SearchComponent
} from '@marketmate/shared';
import { DeviceDetectorService } from '@marketmate/shared';
import { FilterService } from '@marketmate/shared';
import { LoggingService, NotificationService } from '@marketmate/shared';
import { calculateHasMore, calculateNextPage, extractItems } from '@marketmate/shared';
import { FiltersComponent } from '../filters-component/filters.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { AppButtonComponent } from '@marketmate/shared';

@Component({
	selector: 'mm-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [
		...SHARED_UI_DEPS,
		FiltersComponent,
		ListingCardComponent,
		ListingCardSkeletonComponent,
		AppButtonComponent,
		EmptyStateComponent,
		SearchComponent
	]
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {

	destroy$: Subject<void> = new Subject<void>();
	listings: Listing[] = [];
	searchQuery = '';
	isExpanded = true;
	isMobile = false;
	render = false;
	currentPage = 0;
	hasMore = true;
	isLoading = false;
	private intersectionObserver?: IntersectionObserver;
	private listingsRequestSeq = 0;

	constructor(
			private listingService: ListingService,
			private router: Router,
			private route: ActivatedRoute,
			private cdr: ChangeDetectorRef,
			private deviceDetectorService: DeviceDetectorService,
			private filterService: FilterService,
			private notificationService: NotificationService,
			private logger: LoggingService,
			private bottomSheet: MatBottomSheet,
			@Inject(PLATFORM_ID) private platformId: Object
	) {
	}

	ngOnInit() {
		this.setIsMobile();

		if (isPlatformServer(this.platformId)) {
			this.isLoading = true;
			this.cdr.markForCheck();
			return;
		}
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
					this.searchQuery = params.get('search') ?? '';
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
					this.cdr.markForCheck();
				});
	}


	updateQueryParams(queryParams: Record<string, string | number | boolean>) {
		const sanitized: Record<string, string | number | boolean | null> = {};
		Object.entries(queryParams).forEach(([key, value]) => {
			if (typeof value === 'string' && value.trim() === '') {
				sanitized[key] = null;
			} else {
				sanitized[key] = value;
			}
		});
		this.router.navigate([], {
			relativeTo: this.route,
			queryParams: sanitized,
			queryParamsHandling: 'merge',
			replaceUrl: true
		}).then(r => null);
	}


	getListings(
			queryParams: Record<string, string | number | boolean>,
			page?: number,
			append: boolean = false) {
		if (isPlatformServer(this.platformId)) return;

		if (append && this.isLoading) return;

		const reqId = ++this.listingsRequestSeq;
		this.listings = [];
		this.isLoading = true;
		this.cdr.markForCheck();
		const pageToLoad = page ?? this.currentPage;

		this.listingService.getAll(queryParams, pageToLoad)
				.pipe(takeUntil(this.destroy$))
				.subscribe(res => {
					if (reqId !== this.listingsRequestSeq) return;

					this.isLoading = false;
					if (res.isSuccessful()) {
						const response = res.body?.data;
						const newItems = extractItems(response);

						if (append) {
							this.listings = [...this.listings, ...newItems];
						} else {
							this.listings = newItems;
							this.currentPage = 0;
							setTimeout(() => this.observeSentinel(), 0);
						}

						this.hasMore = calculateHasMore(response, pageToLoad);
						this.currentPage = calculateNextPage(response, pageToLoad, append);
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
		if (!isPlatformBrowser(this.platformId) || typeof IntersectionObserver === 'undefined') {
			// Fallback for SSR or browsers that don't support IntersectionObserver
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
		if (!isPlatformBrowser(this.platformId)) return;
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
		return index;
	}

	toggleFilters(expand: boolean) {
		this.isExpanded = expand;
		this.cdr.markForCheck();
	}

	openFiltersBottomSheet() {
		const panelClass = 'home-filters-bottomsheet-container';
		const backdropClass = 'home-filters-bottomsheet-backdrop';
		this.bottomSheet.open(FiltersComponent, {
			panelClass,
			backdropClass,
			data: { isBottomSheet: true },
		});
	}

	onMobileSearchChange(value: string) {
		const v = (value ?? '').trim();
		this.filterService.updateFilter({ search: v });
		this.router.navigate([], {
			relativeTo: this.route,
			queryParams: v ? { search: v } : { search: null },
			queryParamsHandling: 'merge',
			replaceUrl: true,
		}).then(() => null);
		this.cdr.markForCheck();
	}

	ngOnDestroy() {
		if (this.intersectionObserver) {
			this.intersectionObserver.disconnect();
		}
		this.destroy$.next();
		this.destroy$.complete();
	}
}
