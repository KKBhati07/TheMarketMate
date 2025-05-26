import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from "@angular/core";
import {NavigationEnd, Router} from "@angular/router";
import {BehaviorSubject, filter} from "rxjs";
import {AuthService} from "../../services/auth.service";
import {User} from "../../models/user.model";
import {Redirect} from "../../models/login-signup.model";
import {AppUrls} from "../../app.urls";
import {CONSTANTS} from "../../app.constants";
import {DeviceDetectorService} from "../../app-util/services/device-detector.service";
import {CategoryService} from "../../services/category.service";


@Component({
  selector: 'mm-app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppHeaderComponent implements OnInit {
  categories: string[] = []
  protected readonly CONSTANTS = CONSTANTS;
  isMobile = false;
  isLoading = true;
  isAdmin = false;
  showHeader = true;

  isAuthenticated$ = new BehaviorSubject<boolean>(false);
  user: User | null = null;
  renderIcon = false;
  expandProfile = false;
  expandedCategories = false;
  renderExpandedContent = false

  constructor(private router: Router,
              private authService: AuthService,
              private cdr: ChangeDetectorRef,
              private deviceDetector: DeviceDetectorService,
              private categoryService: CategoryService
  ) {
  }

  ngOnInit() {
    this.checkForActiveRoute();
    this.checkForAuthenticationAndSetUser();
    this.setIsMobile()
    this.checkForUserUpdate();
  }

  checkForUserUpdate() {
    this.authService.getUpdatedUser().subscribe(user => {
      this.user = user;
      this.isAdmin = this.user.is_admin;
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
      [AppUrls.USER.USER_PROFILE(uuid)]
    ).then(r => {
      this.closeHeader();
    });
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
        console.warn(res.body)
        if (res.body?.data?.status === 200) {
          this.router.navigate([AppUrls.ROOT]).then(r => {
            window.location.reload();
          });
        } else {
          //TODO:: Notification Service for failed logout!
        }
      }
    })
  }

  onCategoryAndHomeClick(category: any = '') {
    const queryParams = category ? {queryParams: {category}} : {}
    this.router.navigate([AppUrls.HOME], queryParams).then(r => {
      this.closeHeader();
    });
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
      if (!this.user?.profileUrl) this.renderIcon = true;
      this.isAdmin = this.user?.is_admin ?? false;
    }
    this.isLoading = false;
    this.cdr.detectChanges();
  }

  onNavigationClick(redirectTo: Redirect) {
    if (!redirectTo) return;
    if (redirectTo === 'login') {
      this.router.navigate(AppUrls.AUTH.LOGIN.split('/'),
        {queryParams: {redirect: this.router.url}}).then(r => null)
    } else if (redirectTo === 'signup') {
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
