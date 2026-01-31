import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { Listing, LoggingService, NotificationService } from 'mm-shared';
import { map, Subject, takeUntil } from 'rxjs';
import { AdminService } from '../../../services/admin.service';
import { AppUrls } from '../../../utils/app.urls';
import { ActivatedRoute } from '@angular/router';
import { distinctUntilChanged } from 'rxjs/operators';

@Component({
	selector: 'mm-admin-listing',
	templateUrl: './listing.component.html',
	styleUrls: ['./listing.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListingComponent implements OnInit, AfterViewInit, OnDestroy {

	listings: Listing[] = [];
	isSelectionMode = false;
	destroy$: Subject<void> = new Subject<void>();
	queryParams: Record<string, string | number | boolean> = {}
	selectedListings: number[] = [];
	isDeletedListingPage: boolean = false;
	currentPage = 0;
	hasMore = true;
	isLoading = false;
	private intersectionObserver?: IntersectionObserver;

	protected readonly AppUrls = AppUrls;

	constructor(
			private adminService: AdminService,
			private cdr: ChangeDetectorRef,
			private route: ActivatedRoute,
			private notificationService: NotificationService,
			private logger: LoggingService,
	) {
	}

	ngOnInit() {
		this.subscribeToParamChange();
	}

	ngAfterViewInit() {
		this.setupIntersectionObserver();
	}

	subscribeToParamChange() {
		this.route.queryParamMap.pipe(
				takeUntil(this.destroy$),
				map(qpm => {
					const raw = qpm.get('posts') ?? 'all';
					return raw.toLowerCase() === 'deleted';
				}),
				distinctUntilChanged()
		).subscribe(deleted => {
			this.isDeletedListingPage = deleted;
			this.currentPage = 0;
			this.hasMore = true;
			this.getListings(deleted, 0, false);
		})
	}

	getListings(deleted: boolean = false, page?: number, append: boolean = false) {
		if (this.isLoading) return;

		this.isLoading = true;
		this.queryParams['deleted'] = deleted;
		const pageToLoad = page ?? this.currentPage;

		this.adminService.getAllListings(this.queryParams, pageToLoad)
				.pipe(takeUntil(this.destroy$))
				.subscribe(
						res => {
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

								// Check if there are more pages
								if (response?.total_pages !== undefined) {
									this.hasMore = (response.current_page ?? pageToLoad) < (response.total_pages - 1);
								} else {
									this.hasMore = newItems.length > 0;
								}

								if (append) {
									this.currentPage = (response?.current_page ?? pageToLoad) + 1;
								} else {
									this.currentPage = (response?.current_page ?? 0) + 1;
								}

								this.cdr.markForCheck();
							} else {
								this.logger.warn('Failed to load listings (admin)', {
									deleted,
									page: pageToLoad,
									status: res.status,
									statusText: res.statusText,
								});
								this.notificationService.error({
									message: 'Failed to load listings. Please try again.',
								});
							}
						}
				)
	}

	setupIntersectionObserver() {
		if (typeof IntersectionObserver === 'undefined') {
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
		this.intersectionObserver?.disconnect();   // important
		const sentinel = document.getElementById('listing-sentinel');
		if (sentinel && this.intersectionObserver) {
			this.intersectionObserver.observe(sentinel);
		}
	}

	loadNextPage() {
		if (!this.hasMore || this.isLoading) return;
		this.getListings(this.isDeletedListingPage, this.currentPage, true);
	}

	onListingSelect({ isSelected, id }: { isSelected: boolean, id: number | undefined }) {
		if (!id) return;
		if (isSelected) {
			this.selectedListings.push(id)
		} else {
			this.selectedListings = this.selectedListings.filter(l => l != id);
		}
	}

	onDeleteClick() {
		if (!this.isSelectionMode || !this.selectedListings.length) return;
		this.adminService.deleteListings(this.selectedListings)
				.pipe(takeUntil(this.destroy$))
				.subscribe(res => {
					if (res.isSuccessful()) {
						this.notificationService.success({
							message: `Listings deleted`,
						});

					} else {
						this.logger.warn('Listing deletion failed', {
							ids: this.selectedListings,
							status: res.status,
							statusText: res.statusText
						});
						this.notificationService.error({
							message: `Listing deletion failed!`,
						});
					}
					this.cdr.markForCheck();
				})
	}

	toggleSelectButton() {
		if (this.isDeletedListingPage) return;
		this.isSelectionMode = !this.isSelectionMode;
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
