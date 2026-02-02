import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Input, OnDestroy, Output, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AppUrls } from '../../../app.urls';
import { AuthService, LoggingService, NotificationService } from '@marketmate/shared';
import { Router } from '@angular/router';
import { fadeInOut } from '@marketmate/shared';
import { Subject, takeUntil } from 'rxjs';
import { handleKeyboardActivation } from '@marketmate/shared';

@Component({
	selector: 'mm-header-user-menu',
	templateUrl: './header-user-menu.component.html',
	styleUrls: ['./header-user-menu.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [fadeInOut]
})
export class HeaderUserMenuComponent implements OnDestroy {

	@Input() userName: string = '';
	@Input() profileImgUrl: string | undefined;
	@Output() closeMenu: EventEmitter<void> = new EventEmitter<void>();
	isLoggingOut = false;
	destroy$: Subject<void> = new Subject<void>();

	constructor(
			private authService: AuthService,
			private router: Router,
			private notificationService: NotificationService,
			private logger: LoggingService,
			@Inject(PLATFORM_ID) private platformId: Object
	) {
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
		console.warn('ON Destroy called !!')
		this.destroy$.next();
		this.destroy$.complete();
	}

}