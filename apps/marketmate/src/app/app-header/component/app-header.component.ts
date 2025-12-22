import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	ElementRef,
	HostListener,
	OnInit,
	ViewChild
} from "@angular/core";
import { ActivatedRoute, NavigationEnd, Params, Router } from "@angular/router";
import { BehaviorSubject, filter } from "rxjs";
import { AuthService } from "mm-shared";
import { User } from "mm-shared";
import { Redirect } from "mm-shared";
import { AppUrls } from "../../app.urls";
import { AppUrls as SharedUrls } from "mm-shared";
import { CONSTANTS } from "../../app.constants";
import { DeviceDetectorService } from "mm-shared";
import { CategoryService } from "../../services/category.service";
import { Category } from 'mm-shared';
import { NavOption } from 'mm-shared';
import {
	PublishEditListingFormComponent
} from '../../app-util/module/component/publish-listing-form/publish-edit-listing-form.component';
import { MatDialog } from '@angular/material/dialog';
import { FilterService } from 'mm-shared';
import { environment } from '../../../environments/environment';

@Component({
	selector: 'mm-app-header',
	templateUrl: './app-header.component.html',
	styleUrls: ['./app-header.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppHeaderComponent implements OnInit {
	categories: Category[] = []
	isMobile = false;
	isLoading = true;
	isAdmin = false;
	showHeader = true;
	showHeaderMenu = false;
	showUserMenu = false;
	isAuthenticated$ = new BehaviorSubject<boolean>(false);

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
		if (this.expandedCategories) {
			this.expandedCategories = false;
		}
	}

	checkForUserUpdate() {
		this.authService.getUpdatedUser().subscribe(user => {
			this.user = user;
			this.renderIcon = false;
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

	get loginQueryParams(): Params {
		return { redirect: this.router.url }
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
		this.closeHeader()
		this.showUserMenu = !this.showUserMenu;
		this.cdr.markForCheck();
	}

	onAdminClick() {
		window.open(environment.adminUrl, '_blank', 'noopener');
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
		this.deviceDetector.isMobile().subscribe(isMobile => {
			this.isMobile = isMobile;
			this.cdr.markForCheck();
		});
	}

	onLogoClick() {
		this.router.navigate(AppUrls.ROOT.split('/')).then(r => null);
	}
}
