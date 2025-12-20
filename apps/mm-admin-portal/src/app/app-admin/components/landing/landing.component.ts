import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { NavigationStart, Router } from "@angular/router";
import { AppUrls } from '../../../utils/app.urls';
import { DeviceDetectorService } from "mm-shared";
import { Subject, takeUntil } from "rxjs";

@Component({
	selector: "mm-admin",
	templateUrl: "./landing.component.html",
	styleUrls: ["./landing.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush,
})

export class LandingComponent implements OnInit, OnDestroy {
	isMobile: boolean = false;
	isUsersSelected = true;
	destroy$ = new Subject();

	protected readonly AppUrls = AppUrls;

	constructor(private router: Router,
							private deviceDetectorService: DeviceDetectorService,
							private cdr: ChangeDetectorRef
	) {
	}
	// TODO :: Complete multiselect delete functionality!!
	ngOnInit() {
		this.setIsMobile();
		this.subscribeToRoute();
	}

	subscribeToRoute() {
		this.router.events
				.pipe(takeUntil(this.destroy$))
				.subscribe(event => {
			if (event instanceof NavigationStart && event.url === '/' + AppUrls.ADMIN.LANDING) {
				this.router.navigate([AppUrls.ADMIN.LANDING,AppUrls.ADMIN.USERS]).then(r => null);
				this.isUsersSelected = true;
				this.cdr.markForCheck();
			}
		});
	}


	setIsMobile() {
		this.deviceDetectorService.isMobile()
				.pipe(takeUntil(this.destroy$))
				.subscribe(isMobile => {
					this.isMobile = isMobile;
					this.cdr.markForCheck();
				});
	}

	//Deprecated Method, will remove in future
	onNavItemClick(navToUser: boolean) {
		if (navToUser) {
			this.router.navigate([AppUrls.ADMIN.LANDING,AppUrls.ADMIN.USERS]).then(r => null);
			this.isUsersSelected = true;
			this.cdr.markForCheck();
			return
		}
		this.isUsersSelected = false;
		this.router.navigate([AppUrls.ADMIN.LANDING,AppUrls.ADMIN.LISTINGS]).then(r => null);
		this.cdr.markForCheck();
	}

	ngOnDestroy() {
		this.destroy$.next(true);
		this.destroy$.complete();
	}
}
