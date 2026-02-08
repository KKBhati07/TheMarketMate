import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	EventEmitter,
	Inject,
	Input,
	OnDestroy,
	OnInit,
	Output,
	PLATFORM_ID
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AppUrls } from '../../../app.urls';
import {
	AuthService,
	LoggingService,
	NotificationService,
	SHARED_UI_DEPS,
	fadeInOut,
	ThemeService,
	CONSTANTS,
	AppToggleComponent
} from '@marketmate/shared';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { handleKeyboardActivation } from '@marketmate/shared';
import { UserMenuNavComponent } from '../app-user-menu-nav/app-user-menu-nav.component';

@Component({
	selector: 'mm-header-user-menu',
	templateUrl: './header-user-menu.component.html',
	styleUrls: ['./header-user-menu.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [fadeInOut],
	standalone: true,
	imports: [...SHARED_UI_DEPS, UserMenuNavComponent, AppToggleComponent]
})
export class HeaderUserMenuComponent implements OnInit, OnDestroy {

	@Input() userName: string = '';
	@Input() profileImgUrl: string | undefined;
	@Output() closeMenu: EventEmitter<void> = new EventEmitter<void>();
	isLoggingOut = false;
	isLightTheme = false;
	destroy$: Subject<void> = new Subject<void>();

	constructor(
			private authService: AuthService,
			private router: Router,
			private notificationService: NotificationService,
			private logger: LoggingService,
			private themeService: ThemeService,
			private cdr: ChangeDetectorRef,
			@Inject(PLATFORM_ID) private platformId: Object
	) {
	}

	ngOnInit() {
		this.updateThemeState();
	}

	updateThemeState() {
		const currentTheme = this.themeService.ActiveTheme;
		this.isLightTheme = currentTheme === CONSTANTS.THEME.LIGHT;
		this.cdr.markForCheck();
	}

	onThemeToggle(checked: boolean) {
		if (checked) {
			this.themeService.setDark();
		} else {
			this.themeService.setLight();
		}
		this.updateThemeState();
	}

	onUserIconClick(event: Event) {
		event.stopPropagation();
		const uuid = this.authService.UserDetails?.uuid;
		if (!uuid) return;
		this.router.navigate(
				[AppUrls.USER.BASE, AppUrls.USER.USER_PROFILE(uuid)],
				{ queryParams: { posts: true } }
		).then(r => {
			this.closeMenu.emit();
		});
	}

	onLogOutClick(event: Event) {
		event.stopPropagation();
		if (this.isLoggingOut) return;
		this.isLoggingOut = true;
		this.authService.logoutUser()
				.pipe(takeUntil(this.destroy$))
				.subscribe(res => {
					this.isLoggingOut = false;
					if (res.isSuccessful()) {
						this.router.navigate([AppUrls.ROOT]).then(r => {
							if (isPlatformBrowser(this.platformId)) {
								window.location.reload();
							}
						});
					} else {
						this.logger.warn('Logout attempt failed', { status: res.status, statusText: res.statusText });
						this.notificationService.error({
							message: `Logout attempt failed`,
						});
					}
				})
	}

	onOuterKeydown(event: KeyboardEvent) {
		handleKeyboardActivation(() => this.closeMenu.emit(), event);
	}

	ngOnDestroy() {
		this.destroy$.next();
		this.destroy$.complete();
	}

}