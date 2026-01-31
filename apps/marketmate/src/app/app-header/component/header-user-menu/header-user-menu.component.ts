import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { AppUrls } from '../../../app.urls';
import { AuthService, LoggingService, NotificationService } from 'mm-shared';
import { Router } from '@angular/router';
import { fadeInOut } from 'mm-shared';

@Component({
	selector: 'mm-header-user-menu',
	templateUrl: './header-user-menu.component.html',
	styleUrls: ['./header-user-menu.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [fadeInOut]
})
export class HeaderUserMenuComponent {

	@Input() userName: string = '';
	@Input() profileImgUrl: string | undefined;
	@Output() closeMenu: EventEmitter<void> = new EventEmitter<void>();

	constructor(
			private authService: AuthService,
			private router: Router,
			private notificationService: NotificationService,
			private logger: LoggingService,
	) {
	}

	onUserIconClick() {
		const uuid = this.authService.UserDetails?.uuid;
		if (!uuid) return;
		this.router.navigate(
				[AppUrls.USER.BASE,AppUrls.USER.USER_PROFILE(uuid)],
				{ queryParams: { posts: true } }
		).then(r => {
			this.closeMenu.emit();
		});
	}

	onLogOutClick() {
		this.authService.logoutUser().subscribe(res => {
			if (res.isSuccessful()) {
				this.router.navigate([AppUrls.ROOT]).then(r => {
					window.location.reload();
				});
			} else {
				this.logger.warn('Logout attempt failed', { status: res.status, statusText: res.statusText });
				this.notificationService.error({
					message: `Logout attempt failed`,
				});
			}
		})
	}

}