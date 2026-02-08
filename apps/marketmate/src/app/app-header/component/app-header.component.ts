import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	ElementRef,
	HostListener,
	Inject,
	OnDestroy,
	OnInit,
	PLATFORM_ID,
	ViewChild
} from "@angular/core";
import { isPlatformBrowser } from '@angular/common';
import { NavigationEnd, Params, Router } from "@angular/router";
import { BehaviorSubject, filter, Subject, takeUntil } from "rxjs";
import { AuthService, SHARED_UI_DEPS, AppNavButtonComponent } from "@marketmate/shared";
import { User } from "@marketmate/shared";
import { Redirect } from "@marketmate/shared";
import { AppUrls } from "../../app.urls";
import { AppUrls as SharedUrls } from "@marketmate/shared";
import { CONSTANTS } from "../../app.constants";
import { DeviceDetectorService } from "@marketmate/shared";
import { CategoryService } from "../../services/category.service";
import { Category } from '@marketmate/shared';
import { NavOption } from '@marketmate/shared';
import { LoggingService, NotificationService } from '@marketmate/shared';
import { handleKeyboardActivation } from '@marketmate/shared';
import {
	PublishEditListingFormComponent
} from '../../app-util/module/component/publish-listing-form/publish-edit-listing-form.component';
import { MatDialog } from '@angular/material/dialog';
import { FilterService } from '@marketmate/shared';
import { environment } from '../../../environments/environment';
import { AppHeaderMenuComponent } from './app-header-menu/app-header-menu.component';
import { HeaderUserMenuComponent } from './header-user-menu/header-user-menu.component';
import { SellItemButtonComponent } from '../../app-util/module/component/app-sell-item-button/app-sell-item-btn.component';
import { ProductCategoryComponent } from '../../app-util/module/component/product-category/product-category.component';
import { CategorySkeletonComponent } from '../../app-util/module/component/category-skeleton/category-skeleton.component';

@Component({
	selector: 'mm-app-header',
	templateUrl: './app-header.component.html',
	styleUrls: ['./app-header.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [...SHARED_UI_DEPS, AppNavButtonComponent, AppHeaderMenuComponent, HeaderUserMenuComponent, SellItemButtonComponent, ProductCategoryComponent, CategorySkeletonComponent]
})
export class AppHeaderComponent implements OnInit, OnDestroy {
	categories: Category[] = []
	isMobile = false;
	isLoading = true;
	categoriesLoading = false;
	isAdmin = false;
	showHeader = true;
	showHeaderMenu = false;
	showUserMenu = false;
	isAuthenticated$ = new BehaviorSubject<boolean>(false);
	destroy$: Subject<void> = new Subject<void>();

	user: User | null = null;
	renderIcon = false;
	expandedCategories = false;
	renderExpandedContent = false;
	@ViewChild('header') header!: ElementRef;

	protected readonly AppUrls = AppUrls;
	protected readonly SharedUrls = SharedUrls;
	protected readonly CONSTANTS = CONSTANTS;

	constructor(
			private router: Router,
			private authService: AuthService,
			private cdr: ChangeDetectorRef,
			private deviceDetector: DeviceDetectorService,
			private categoryService: CategoryService,
			private filterService: FilterService,
			private notificationService: NotificationService,
			private logger: LoggingService,
			private dialog: MatDialog,
			@Inject(PLATFORM_ID) private platformId: Object
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
		if (!isPlatformBrowser(this.platformId)) return;
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
			case 'SELL_ITEM':
				this.onSellItemClick();
				break;
			case 'CATEGORIES':
				this.onCategoriesClick();
				break;
			case 'ADMIN':
				this.onAdminClick();
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


	onCategorySelect(category: Category | null = null) {
		category && this.filterService.updateFilter({ category_id: category.id })

		this.router.navigate([AppUrls.HOME])
				.then(r => {
					this.closeHeader();
				});
	}

	onHeaderMenuClick() {
		this.showHeaderMenu = !this.showHeaderMenu;
		this.closeExpandedHeader();
		this.cdr.markForCheck();
	}

	getCategories() {
		this.categoriesLoading = true;
		this.cdr.markForCheck();
		this.categoryService.getCategories()
				.pipe(takeUntil(this.destroy$))
				.subscribe(res => {
					this.categoriesLoading = false;
					if (res.isSuccessful()) {
						this.categories = res.body?.data?.categories ?? [];
						this.cdr.markForCheck();
					} else {
						this.logger.warn('Failed to load categories', { status: res.status, statusText: res.statusText });
						this.notificationService.error({
							message: 'Failed to load categories. Please try again.',
						});
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

	get loginQueryParams(): Params {
		return { redirect: this.router.url }
	}

	onNavigationClick(redirectTo: Redirect) {
		if (!redirectTo) return;
		if (redirectTo === 'LOGIN') {
			this.router.navigate([SharedUrls.AUTH.BASE, SharedUrls.AUTH.LOGIN],
					{ queryParams: { redirect: this.router.url } }).then(r => null)
		} else if (redirectTo === 'SIGNUP') {
			this.router.navigate([SharedUrls.AUTH.BASE, SharedUrls.AUTH.SIGNUP]).then(r => null)
		}
	}

	onProfileClick() {
		this.closeHeader()
		this.showUserMenu = !this.showUserMenu;
		this.cdr.markForCheck();
	}

	onProfileKeydown(event: KeyboardEvent) {
		handleKeyboardActivation(() => this.onProfileClick(), event);
	}

	onMenuIconKeydown(event: KeyboardEvent) {
		handleKeyboardActivation(() => this.onHeaderMenuClick(), event);
	}

	onAdminClick() {
		if (isPlatformBrowser(this.platformId)) {
			window.open(environment.adminAppUrl, '_blank', 'noopener');
		}
		this.closeHeader();
	}

	onCategoriesClick() {
		if (this.expandedCategories) {
			this.expandedCategories = !this.expandedCategories;
		} else {
			this.expandedCategories = true;
			this.getCategories();
		}
		this.cdr.markForCheck();
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
