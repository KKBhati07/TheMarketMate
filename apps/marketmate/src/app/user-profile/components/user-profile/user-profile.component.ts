import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from "@angular/core";
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router } from "@angular/router";
import { DeviceDetectorService, UserDetailsDto } from "@marketmate/shared";
import { UserService } from "../../../services/user.service";
import { Subject, takeUntil } from "rxjs";
import { AppUrls } from "../../../app.urls";
import { ProfileDetailsComponent } from '../profile-details/profile-details.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ListingService } from '../../../services/listing.service';
import { Listing } from '@marketmate/shared';
import { AuthService } from '@marketmate/shared';
import { LoggingService, NotificationService } from '@marketmate/shared';
import { calculateHasMore, calculateNextPage, extractItems } from '@marketmate/shared';

@Component({
	selector: "mm-user-profile",
	templateUrl: "./user-profile.component.html",
	styleUrls: ["./user-profile.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserProfileComponent implements OnInit, AfterViewInit, OnDestroy {
	renderComponent = false;
	expandProfileDetails = false;
	isMobile = false;
	userDetails: UserDetailsDto | null = null;
	self: boolean = false;
	destroy$: Subject<void> = new Subject<void>();
	userUuid: string = '';
	userListings: Listing[] = [];
	favoriteListings: Listing[] = [];
	selfUser = false;
	selectedTabIndex = 0;

	// Pagination state for posts
	postsCurrentPage = 0;
	postsHasMore = true;
	postsIsLoading = false;

	// Pagination state for favorites
	favoritesCurrentPage = 0;
	favoritesHasMore = true;
	favoritesIsLoading = false;

	private intersectionObserver?: IntersectionObserver;

	constructor(
			private router: Router,
			private deviceDetector: DeviceDetectorService,
			private cdr: ChangeDetectorRef,
			private userService: UserService,
			private authService: AuthService,
			private activatedRoute: ActivatedRoute,
			private bottomSheet: MatBottomSheet,
			private listingService: ListingService,
			private notificationService: NotificationService,
			private logger: LoggingService,
			@Inject(PLATFORM_ID) private platformId: Object
	) {
	}

	ngOnInit() {
		this.userUuid = this.activatedRoute.snapshot.params['uuid'];
		this.selfUser =
				this.authService.UserDetails?.uuid.toLowerCase()
				=== this.userUuid.toLowerCase();
		this.setTabFronQueryParams();
		this.setIsMobile();
		this.getUserDetails();
	}

	ngAfterViewInit() {
		this.setupIntersectionObserver();
	}

	onTabChange(index: number) {
		this.selectedTabIndex = index;
		setTimeout(() => this.observeSentinel(), 0);
		if (index === 0) {
			this.updateQueryParams({ posts: true })
			if (!this.userListings.length) {
				this.postsCurrentPage = 0;
				this.postsHasMore = true;
				this.getListingsByUser(this.userUuid, 0, false);
			}
		}
		if (index === 1) {
			this.updateQueryParams({ favorites: true })
			if (!this.favoriteListings.length) {
				this.favoritesCurrentPage = 0;
				this.favoritesHasMore = true;
				this.getFavoriteListingsByUser(this.userUuid, 0, false);
			}
		}
	}

	setIsMobile() {
		this.deviceDetector.isMobile()
				.pipe(takeUntil(this.destroy$))
				.subscribe(isMobile => {
					this.isMobile = isMobile;
					this.cdr.markForCheck();
				})
	}

	setTabFronQueryParams() {
		const qp = this.activatedRoute.snapshot.queryParams;
		if (qp['posts'] == undefined && qp['favorites'] == undefined) {
			this.updateQueryParams({ posts: true })
			this.postsCurrentPage = 0;
			this.postsHasMore = true;
			return this.getListingsByUser(this.userUuid, 0, false);
		}
		if (qp['favorites']) {
			if (this.selfUser) {
				this.selectedTabIndex = 1;
				this.favoritesCurrentPage = 0;
				this.favoritesHasMore = true;
				return this.getFavoriteListingsByUser(this.userUuid, 0, false);
			} else {
				this.updateQueryParams({ posts: true })
				this.postsCurrentPage = 0;
				this.postsHasMore = true;
				return this.getListingsByUser(this.userUuid, 0, false);
			}

		}
		if (qp['posts']) {
			this.postsCurrentPage = 0;
			this.postsHasMore = true;
			return this.getListingsByUser(this.userUuid, 0, false);
		}
	}

	updateQueryParams(queryParams: Record<string, boolean>) {
		this.router.navigate(this.activatedRoute.snapshot.url.map(uri => uri.path), {
			queryParams,
			replaceUrl: true
		}).then(r => null);
	}

	onExpandProfileDetails(expand: boolean) {
		this.expandProfileDetails = expand;
		this.cdr.markForCheck();
	}

	showDetailsBottomSheet(open: boolean) {
		const panelClass = 'profile-details-bottomsheet-container'
		const backdropClass = 'profile-details-bottomsheet-backdrop'
		this.bottomSheet.open(ProfileDetailsComponent, {
			panelClass: panelClass,
			backdropClass: backdropClass,
			data: {
				isBottomSheet: true,
				userDetails: this.userDetails,
				isMobile: this.isMobile,
			}
		});
	}

	getListingsByUser(uuid: string, page?: number, append: boolean = false) {
		if (this.postsIsLoading) return;

		this.postsIsLoading = true;
		const pageToLoad = page ?? this.postsCurrentPage;

		this.listingService.getByUser(uuid, pageToLoad)
				.pipe(takeUntil(this.destroy$))
				.subscribe(res => {
					this.postsIsLoading = false;
					if (res.isSuccessful()) {
						const response = res.body?.data;
						const newItems = extractItems(response);

						if (append) {
							this.userListings.push(...newItems);
						} else {
							this.userListings = newItems;
							this.postsCurrentPage = 0;
						}

						this.postsHasMore = calculateHasMore(response, pageToLoad);
						this.postsCurrentPage = calculateNextPage(response, pageToLoad, append);
						this.renderComponent = true;
						this.cdr.markForCheck();
					} else {
						this.logger.warn('Failed to load user listings', {
							uuid,
							page: pageToLoad,
							status: res.status,
							statusText: res.statusText
						});
						this.notificationService.error({
							message: 'Failed to load posts. Please try again.',
						});
					}
				})
	}

	getFavoriteListingsByUser(uuid: string, page?: number, append: boolean = false) {
		if (this.favoritesIsLoading) return;

		this.favoritesIsLoading = true;
		const pageToLoad = page ?? this.favoritesCurrentPage;

		this.listingService.getFavoriteByUser(uuid, pageToLoad)
				.pipe(takeUntil(this.destroy$))
				.subscribe(res => {
					this.favoritesIsLoading = false;
					if (res.isSuccessful()) {
						const response = res.body?.data;
						const newItems = extractItems(response);

						if (append) {
							this.favoriteListings.push(...newItems);
						} else {
							this.favoriteListings = newItems;
							this.favoritesCurrentPage = 0;
						}

						this.favoritesHasMore = calculateHasMore(response, pageToLoad);
						this.favoritesCurrentPage = calculateNextPage(response, pageToLoad, append);
						this.renderComponent = true;
						this.cdr.markForCheck();
					} else {
						this.logger.warn('Failed to load favorite listings', {
							uuid,
							page: pageToLoad,
							status: res.status,
							statusText: res.statusText
						});
						this.notificationService.error({
							message: 'Failed to load favorites. Please try again.',
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
						if (entry.isIntersecting) {
							if (this.selectedTabIndex === 0 && this.postsHasMore
									&& !this.postsIsLoading && this.userListings.length > 0) {
								this.loadNextPagePosts();
							} else if (this.selectedTabIndex === 1 && this.favoritesHasMore
									&& !this.favoritesIsLoading && this.favoriteListings.length > 0
							) {
								this.loadNextPageFavorites();
							}
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
		const sentinel = document.getElementById('user-profile-sentinel');
		if (sentinel && this.intersectionObserver) {
			this.intersectionObserver.observe(sentinel);
		}
	}

	loadNextPagePosts() {
		if (!this.postsHasMore || this.postsIsLoading) return;
		this.getListingsByUser(this.userUuid, this.postsCurrentPage, true);
	}

	loadNextPageFavorites() {
		if (!this.favoritesHasMore || this.favoritesIsLoading) return;
		this.getFavoriteListingsByUser(this.userUuid, this.favoritesCurrentPage, true);
	}


	trackByListingId(index: number, item: Listing) {
		return item.id;
	}


	getUserDetails() {
		this.userService.getDetails(this.userUuid)
				.pipe(takeUntil(this.destroy$))
				.subscribe(res => {
					if (res.isSuccessful()) {
						this.userDetails = res.body?.data?.user_details ?? null;
						if (this.userDetails) this.self = res.body?.data?.self ?? false;
						this.renderComponent = true;
						this.expandProfileDetails = true;
						this.cdr.markForCheck();
					} else {
						this.router.navigate([AppUrls.FOUROFOUR]).then(r => null);
					}
				})
	}

	ngOnDestroy() {
		if (this.intersectionObserver) {
			this.intersectionObserver.disconnect();
		}
		this.destroy$.next();
		this.destroy$.complete();
	}

}
