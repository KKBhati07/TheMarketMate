import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { DeviceDetectorService } from "mm-shared";
import { UserService } from "../../../services/user.service";
import { ProfileDetails } from "mm-shared";
import { Subject, takeUntil } from "rxjs";
import { AppUrls } from "../../../app.urls";
import { ProfileDetailsComponent } from '../profile-details/profile-details.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ListingService } from '../../../services/listing.service';
import { Listing } from 'mm-shared';
import { AuthService } from 'mm-shared';
import { LoggingService, NotificationService } from 'mm-shared';

@Component({
	selector: "mm-user-profile",
	templateUrl: "./user-profile.component.html",
	styleUrls: ["./user-profile.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserProfileComponent implements OnInit, OnDestroy {
	renderComponent = false;
	expandProfileDetails = false;
	isMobile = false;
	userDetails: ProfileDetails | null = null;
	destroy$ = new Subject();
	userUuid: string = '';
	userListings: Listing[] = [];
	favoriteListings: Listing[] = [];
	selfUser = false;
	selectedTabIndex = 0;

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

	onTabChange(index: number) {
		this.selectedTabIndex = index;
		if (index === 0) {
			this.updateQueryParams({ posts: true })
			return !this.userListings.length &&
					this.getListingsByUser(this.userUuid);
		}
		if (index === 1) {
			this.updateQueryParams({ favorites: true })
			return !this.favoriteListings.length &&
					this.getFavoriteListingsByUser(this.userUuid);
		}
	}

	setIsMobile() {
		this.deviceDetector.isMobile().subscribe(isMobile => {
			this.isMobile = isMobile;
			this.cdr.markForCheck();
		})
	}

	setTabFronQueryParams() {
		const qp = this.activatedRoute.snapshot.queryParams;
		if (qp['posts'] == undefined && qp['favorites'] == undefined) {
			this.updateQueryParams({ posts: true })
			return this.getListingsByUser(this.userUuid);
		}
		if (qp['favorites']) {
			if (this.selfUser) {
				this.selectedTabIndex = 1;
				return this.getFavoriteListingsByUser(this.userUuid);
			} else {
				this.updateQueryParams({ posts: true })
				return this.getListingsByUser(this.userUuid);
			}

		}
		if (qp['posts']) {
			return this.getListingsByUser(this.userUuid);
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
		this.listingService.getByUser(uuid, page)
				.pipe(takeUntil(this.destroy$))
				.subscribe(res => {
					if (res.isSuccessful()) {
						if (append) {
							this.userListings.push(...(res.body?.data.items ?? []))
						} else {
							this.userListings = res.body?.data.items ?? []
						}
						this.renderComponent = true;
						this.cdr.markForCheck();
					} else {
						this.logger.warn('Failed to load user listings', { uuid, page, status: res.status, statusText: res.statusText });
						this.notificationService.error({
							message: 'Failed to load posts. Please try again.',
						});
					}
				})
	}

	getFavoriteListingsByUser(uuid: string, page?: number, append: boolean = false) {
		this.listingService.getFavoriteByUser(uuid, page)
				.pipe(takeUntil(this.destroy$))
				.subscribe(res => {
					if (res.isSuccessful()) {
						if (append) {
							this.favoriteListings.push(...(res.body?.data.items ?? []))
						} else {
							this.favoriteListings = res.body?.data.items ?? []
						}
						this.renderComponent = true;
						this.cdr.markForCheck();
					} else {
						this.logger.warn('Failed to load favorite listings', { uuid, page, status: res.status, statusText: res.statusText });
						this.notificationService.error({
							message: 'Failed to load favorites. Please try again.',
						});
					}
				})
	}


	trackByListingId(index: number, item: Listing) {
		return item.id;
	}


	getUserDetails() {
		this.userService.getDetails(this.userUuid)
				.pipe(takeUntil(this.destroy$))
				.subscribe(res => {
					if (res.isSuccessful()) {
						this.userDetails = res.body?.data?.user_details;
						if (this.userDetails) this.userDetails.self = res.body?.data?.self
						this.renderComponent = true;
						this.expandProfileDetails = true;
						this.cdr.markForCheck();
					} else {
						this.router.navigate([AppUrls.FOUROFOUR]).then(r => null);
					}
				})
	}

	ngOnDestroy() {
		this.destroy$.next(null);
		this.destroy$.complete();
	}

}
