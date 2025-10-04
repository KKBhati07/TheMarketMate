import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, Type } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { DeviceDetectorService } from "../../../app-util/services/device-detector.service";
import { UserService } from "../../../services/user.service";
import { ProfileDetails } from "../../../models/user.model";
import { Subject, takeUntil } from "rxjs";
import { AppUrls } from "../../../app.urls";
import { ProfileDetailsComponent } from '../profile-details/profile-details.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';

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

	constructor(
			private router: Router,
			private deviceDetector: DeviceDetectorService,
			private cdr: ChangeDetectorRef,
			private userService: UserService,
			private activatedRoute: ActivatedRoute,
			private bottomSheet: MatBottomSheet
	) {
	}

	ngOnInit() {
		this.setIsMobile();
		this.getUserDetails();
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

	getUserDetails() {
		const uuid = this.activatedRoute.snapshot.params['uuid'];
		this.userService.getDetails(uuid)
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
