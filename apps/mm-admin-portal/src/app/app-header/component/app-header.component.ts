import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	ElementRef,
	HostListener,
	OnDestroy,
	OnInit,
	ViewChild
} from "@angular/core";
import { NavigationEnd, Params, Router } from "@angular/router";
import { BehaviorSubject, filter, Subject, takeUntil } from "rxjs";
import { AuthService, LoggingService, NotificationService } from "@marketmate/shared";
import { User } from "@marketmate/shared";
import { AppUrls as SharedUrls } from "@marketmate/shared";
import { AppUrls } from "../../utils/app.urls";
import { CONSTANTS } from "../../utils/app.constants";
import { DeviceDetectorService } from "@marketmate/shared";
import { NavOption } from '@marketmate/shared';
import { handleKeyboardActivation } from '@marketmate/shared';

@Component({
	selector: 'mm-app-header',
	templateUrl: './app-header.component.html',
	styleUrls: ['./app-header.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppHeaderComponent implements OnInit, OnDestroy {
	protected readonly CONSTANTS = CONSTANTS;
	isMobile = false;
	isLoading = true;
	isAdmin = false;
	showHeader = true;
	showHeaderMenu = false;
	showUserMenu = false;
	destroy$: Subject<void> = new Subject<void>();

	isAuthenticated$ = new BehaviorSubject<boolean>(false);
	user: User | null = null;
	renderIcon = false;
	expandedCategories = false;
	renderExpandedContent = false;
	isLoggingOut = false;
	@ViewChild('header') header!: ElementRef;

	protected readonly AppUrls = AppUrls;
	protected readonly SharedUrls = SharedUrls;

	constructor(
			private router: Router,
			private authService: AuthService,
			private cdr: ChangeDetectorRef,
			private deviceDetector: DeviceDetectorService,
			private notificationService: NotificationService,
			private logger: LoggingService,
	) {
	}

	ngOnInit() {
		this.checkForActiveRoute();
		this.setIsMobile()
		this.checkForAuthenticationAndSetUser();
		this.checkForUserUpdate();
	}

	@HostListener('document:click', ['$event'])
	onDocumentClick(event: MouseEvent): void {
		const headerMenu = document.querySelector('.header-menu-container');
		const target = event.target as Node;
		if (!this.header?.nativeElement.contains(target)
				&& !headerMenu?.contains(target)
		) {
			this.closeExpandedHeader();
		}
	}

	closeExpandedHeader(): void {
		if (this.expandedCategories) {
			this.expandedCategories = false;
		}
	}

	checkForUserUpdate() {
		this.authService.getUpdatedUser()
				.pipe(takeUntil(this.destroy$))
				.subscribe(user => {
					this.user = user;
					this.renderIcon = false;
					this.isAdmin = this.user.admin;
					this.cdr.markForCheck();
				})
	}

	checkForActiveRoute() {
		this.router.events.pipe(
				filter(event => event instanceof NavigationEnd),
				takeUntil(this.destroy$)
		).subscribe((event: NavigationEnd) => {
			this.showHeader = !(event.url.includes(SharedUrls.AUTH.LOGIN)
					|| event.url.includes(SharedUrls.AUTH.SIGNUP));
			this.cdr.markForCheck();
		});
	}

	onMenuItemClick(type: NavOption | null) {
		switch (type) {
			case 'LOGOUT':
				this.onLogOutClick();
				break;
		}
		this.showHeaderMenu = false;
		this.cdr.markForCheck();
	}

	closeHeader() {
		this.expandedCategories = false;
		this.renderExpandedContent = false
		this.cdr.markForCheck();
	}

	onHeaderMenuClick() {
		this.showHeaderMenu = !this.showHeaderMenu;
		this.closeExpandedHeader();
		this.cdr.markForCheck();
	}

	onMenuIconKeydown(event: KeyboardEvent) {
		handleKeyboardActivation(() => this.onHeaderMenuClick(), event);
	}

	private checkForAuthenticationAndSetUser() {
		if (this.authService.Authenticated) {
			this.isAuthenticated$.next(true);
			this.user = this.authService.UserDetails
			if (!this.user?.profile_url) this.renderIcon = true;
			this.isAdmin = this.user?.is_admin ?? this.user?.admin ?? false;
		}
		this.isLoading = false;
		this.cdr.detectChanges();
	}

	get loginQueryParams(): Params {
		return { redirect: this.router.url }
	}

	onLogOutClick() {
		if (this.isLoggingOut) return;
		this.isLoggingOut = true;
		this.cdr.markForCheck();
		this.authService.logoutUser()
				.pipe(takeUntil(this.destroy$))
				.subscribe(res => {
					this.isLoggingOut = false;
					if (res.isSuccessful()) {
						this.router.navigate([AppUrls.ROOT]).then(r => {
							window.location.reload();
						});
					} else {
						this.logger.warn('Logout attempt failed', { status: res.status, statusText: res.statusText });
						this.notificationService.error({
							message: `Logout attempt failed`,
						});
						this.cdr.markForCheck();
					}
				})
	}

	private setIsMobile() {
		this.deviceDetector.isMobile()
				.pipe(takeUntil(this.destroy$))
				.subscribe(isMobile => {
					this.isMobile = isMobile;
					this.cdr.markForCheck();
				});
	}

	onLogoClick() {
		this.router.navigate(AppUrls.ROOT.split('/')).then(r => null);
	}

	ngOnDestroy() {
		this.destroy$.next();
		this.destroy$.complete();
	}
}
