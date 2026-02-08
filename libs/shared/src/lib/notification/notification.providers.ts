import { APP_INITIALIZER, Provider } from '@angular/core';
import { initNotificationOverlay } from './initializer/notification.initializer';
import { NotificationOverlayService } from './notification-overlay.service';

/**
 * Provides notification services and initializer.
 * Must be called in app.config.ts to enable notifications.
 */
export function provideNotification(): Provider[] {
	return [
		NotificationOverlayService,
		{
			provide: APP_INITIALIZER,
			useFactory: initNotificationOverlay,
			deps: [NotificationOverlayService],
			multi: true,
		}
	];
}
