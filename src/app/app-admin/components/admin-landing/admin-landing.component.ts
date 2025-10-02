import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { NavigationStart, Router } from "@angular/router";
import { AppUrls } from "../../../app.urls";
import { DeviceDetectorService } from "../../../app-util/services/device-detector.service";
import { Subject, takeUntil } from "rxjs";

@Component({
	selector: "mm-admin",
	templateUrl: "./admin-landing.component.html",
	styleUrls: ["./admin-landing.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush,
})

export class AdminLandingComponent implements OnInit, OnDestroy {
	isMobile: boolean = false;
	isUsersSelected = true;
	destroy$ = new Subject();

	constructor(private router: Router,
							private deviceDetectorService: DeviceDetectorService,
							private cdr: ChangeDetectorRef
	) {
	}


	ngOnInit() {
		this.navigateToUserList();
		this.setIsMobile();
		this.subscribeToRoute();
	}

	subscribeToRoute() {
		this.router.events.subscribe(event => {
			if (event instanceof NavigationStart && event.url === '/' + AppUrls.ADMIN.LANDING) {
				this.router.navigate([AppUrls.ADMIN.USERS]).then(r => null);
				this.isUsersSelected = true;
				this.cdr.markForCheck();
			}
		});
	}

	navigateToUserList() {
		this.router.navigate([AppUrls.ADMIN.USERS]).then(r => null);
	}

	setIsMobile() {
		this.deviceDetectorService.isMobile()
				.pipe(takeUntil(this.destroy$))
				.subscribe(isMobile => {
					this.isMobile = isMobile;
					this.cdr.markForCheck();
				});
	}

	onNavItemClick(navToUser: boolean) {
		if (navToUser) {
			this.router.navigate([AppUrls.ADMIN.USERS]).then(r => null);
			this.isUsersSelected = true;
			this.cdr.markForCheck();
			return
		}
		this.isUsersSelected = false;
		this.router.navigate([AppUrls.ADMIN.LISTINGS]).then(r => null);
		this.cdr.markForCheck();
	}

	ngOnDestroy() {
		this.destroy$.next(true);
		this.destroy$.complete();
	}
}
