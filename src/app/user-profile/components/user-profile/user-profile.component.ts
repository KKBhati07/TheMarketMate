import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, Type } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { DeviceDetectorService } from "../../../app-util/services/device-detector.service";
import { UserService } from "../../../services/user.service";
import { ProfileDetails } from "../../../models/user.model";
import { Subject, takeUntil } from "rxjs";
import { AppUrls } from "../../../app.urls";
import { ProfileDetailsComponent } from '../profile-details/profile-details.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ListingService } from '../../../services/listing.service';
import { Listing } from '../../../models/listing.model';

@Component({
	selector: "mm-user-profile",
	templateUrl: "./user-profile.component.html",
	styleUrls: ["./user-profile.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserProfileComponent implements OnInit, OnDestroy {
	renderComponent = false;
	expandProfileDetails = true;
	isMobile = false;
	userDetails: ProfileDetails | null = null;
	destroy$ = new Subject();
	userUuid: string = '';
	userListings: Listing[] = [];

	constructor(
			private router: Router,
			private deviceDetector: DeviceDetectorService,
			private cdr: ChangeDetectorRef,
			private userService: UserService,
			private activatedRoute: ActivatedRoute,
			private bottomSheet: MatBottomSheet,
			private listingService: ListingService,
	) {
	}

	ngOnInit() {
		this.userUuid = this.activatedRoute.snapshot.params['uuid'];
		this.setIsMobile();
		this.getUserDetails();
		this.getListingsByUser(this.userUuid);
	}

	setIsMobile() {
		this.deviceDetector.isMobile().subscribe(isMobile => {
			this.isMobile = isMobile;
			this.cdr.markForCheck();
		})
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
						this.cdr.markForCheck();
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
