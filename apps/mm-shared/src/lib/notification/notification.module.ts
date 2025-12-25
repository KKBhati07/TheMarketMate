import { APP_INITIALIZER, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotificationContainerComponent } from './components/notification-container/notification-container.component';
import { NotificationToastComponent } from './components/notification-toast/notification-toast.component';
import { initNotificationOverlay } from './initializer/notification.initializer';
import { NotificationOverlayService } from './notification-overlay.service';
import { SharedModule } from '../modules/shared/mm-shared.module';
import { MatIcon } from '@angular/material/icon';

@NgModule({
	declarations: [
		NotificationContainerComponent,
		NotificationToastComponent,
	],
	imports: [CommonModule, SharedModule, MatIcon],
	exports: [NotificationContainerComponent],
	providers: [
		{
			provide: APP_INITIALIZER,
			useFactory: initNotificationOverlay,
			deps: [NotificationOverlayService],
			multi: true,
		}
	]
})
export class NotificationModule {
}
