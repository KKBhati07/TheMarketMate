import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	ElementRef,
	HostListener,
	OnInit,
	ViewChild
} from "@angular/core";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { BehaviorSubject, filter } from "rxjs";
import { AuthService } from "../../services/auth.service";
import { User } from "../../models/user.model";
import { Redirect } from "../../models/login-signup.model";
import { AppUrls } from "../../app.urls";
import { CONSTANTS } from "../../app.constants";
import { DeviceDetectorService } from "../../app-util/services/device-detector.service";
import { CategoryService } from "../../services/category.service";
import { Category } from '../../models/category.model';
import { NavOption } from '../../models/nav-options.model';
import {
	PublishEditListingFormComponent
} from '../../shared/components/publish-listing-form/publish-edit-listing-form.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
	selector: 'mm-app-header',
	templateUrl: './app-header.component.html',
	styleUrls: ['./app-header.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppHeaderComponent implements OnInit {
	categories: Category[] = []
	protected readonly CONSTANTS = CONSTANTS;
	isMobile = false;
	isLoading = true;
	isAdmin = false;
	showHeader = true;
	showHeaderMenu = false;

	isAuthenticated$ = new BehaviorSubject<boolean>(false);
	user: User | null = null;
	renderIcon = false;
	expandProfile = false;
	expandedCategories = false;
	renderExpandedContent = false;
	@ViewChild('header') header!: ElementRef;

	constructor(
			private router: Router,
			private route: ActivatedRoute,
			private authService: AuthService,
			private cdr: ChangeDetectorRef,
			private deviceDetector: DeviceDetectorService,
			private categoryService: CategoryService,
			private dialog: MatDialog
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
		if (this.expandedCategories || this.expandProfile) {
			this.expandedCategories = false;
			this.expandProfile = false;
		}
	}

	checkForUserUpdate() {
		this.authService.getUpdatedUser().subscribe(user => {
			this.user = user;
			this.isAdmin = this.user.admin;
			this.cdr.markForCheck();
		})
	}

	checkForActiveRoute() {
		this.router.events.pipe(
				filter(event => event instanceof NavigationEnd)
		).subscribe((event: NavigationEnd) => {
			this.showHeader = !(event.url.includes(AppUrls.AUTH.LOGIN)
					|| event.url.includes(AppUrls.AUTH.SIGNUP));
			this.cdr.markForCheck();
		});
	}

	onUsernameClick() {
		const uuid = this.authService.UserDetails?.uuid;
		if (!uuid) return;
		this.router.navigate(
				[AppUrls.USER.USER_PROFILE(uuid)],
				{ queryParams: { posts: true } }
		).then(r => {
			this.closeHeader();
		});
	}

	onSellItemClick() {
		if (this.isAuthenticated$.value) {
			this.openPublishListingForm();
			this.cdr.markForCheck();
			return;
		}
		this.onNavigationClick('LOGIN')
	}

	openPublishListingForm() {
		this.dialog.open(PublishEditListingFormComponent, {
			backdropClass: 'publish-listing-from-backdrop',
			panelClass: this.isMobile ?
					'publish-listing-from-container-mobile'
					: 'profile-edit-from-container',
			hasBackdrop: true,
			data: {
				isMobile: this.isMobile,
			}
		});
	}

	onMenuItemClick(type: NavOption | null) {
		switch (type) {
			case 'LOGIN':
				this.onNavigationClick(type);
				break;
			case 'SIGNUP':
				this.onNavigationClick(type);
				break;
			case 'SELL_ITEM':
				this.onSellItemClick();
				break;
			case 'CATEGORIES':
				this.onCategoriesClick();
				break;
			case 'HOME':
				this.onCategoryOrHomeClick();
				break;
			case 'ADMIN':
				this.onAdminClick();
				break;
		}
		this.showHeaderMenu = false;
		this.cdr.markForCheck();
	}

	closeHeader() {
		this.expandProfile = false;
		this.expandedCategories = false;
		this.renderExpandedContent = false
		this.cdr.markForCheck();
	}

	onLogOutClick() {
		this.authService.logoutUser().subscribe(res => {
			if (res.isSuccessful()) {
				this.router.navigate([AppUrls.ROOT]).then(r => {
					window.location.reload();
				});
			} else {
				//TODO:: Notification Service for failed logout!

			}
		})
	}

	onCategoryOrHomeClick(category: Category | null = null) {
		const queryParams = category ?
				{ category_id: category.id } : {};

		if (category && this.router.url.startsWith(`/${AppUrls.HOME}`)) {
			this.router.navigate([], {
				relativeTo: this.route,
				queryParams,
				queryParamsHandling: 'merge',
			}).then(r => {
				this.closeHeader();
			});
		} else {
			this.router.navigate([AppUrls.HOME], {
				queryParams,
			}).then(r => {
				this.closeHeader();
			});
		}
	}

	onHeaderMenuClick() {
		this.showHeaderMenu = !this.showHeaderMenu;
		this.closeExpandedHeader();
		this.cdr.markForCheck();
	}

	getCategories() {
		this.categoryService.getCategories().subscribe(res => {
			if (res.isSuccessful()) {
				this.categories = res.body?.data?.categories ?? [];
				this.cdr.markForCheck();
			}
		})
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

	onNavigationClick(redirectTo: Redirect) {
		if (!redirectTo) return;
		if (redirectTo === 'LOGIN') {
			this.router.navigate(AppUrls.AUTH.LOGIN.split('/'),
					{ queryParams: { redirect: this.router.url } }).then(r => null)
		} else if (redirectTo === 'SIGNUP') {
			this.router.navigate(AppUrls.AUTH.SIGNUP.split('/')).then(r => null)
		}
	}

	onProfileClick() {
		if (this.expandProfile) {
			this.expandProfile = !this.expandProfile;
			this.renderExpandedContent = false;
		} else {
			this.expandedCategories = false;
			this.expandProfile = !this.expandProfile;
		}

		this.cdr.markForCheck();
	}

	onAdminClick() {
		this.router.navigate([AppUrls.ADMIN.LANDING]).then(r => null)
		this.closeHeader();
	}

	onCategoriesClick() {
		if (this.expandedCategories) {
			this.expandedCategories = !this.expandedCategories;
		} else {
			this.expandProfile = false;
			this.expandedCategories = true;
			this.getCategories();
		}
		this.cdr.markForCheck();
	}

	private setIsMobile() {
		this.deviceDetector.isMobile().subscribe(isMobile => {
			this.isMobile = isMobile;
			this.cdr.markForCheck();
		});
	}

	onLogoClick() {
		this.router.navigate(AppUrls.ROOT.split('/')).then(r => null);
	}
}
