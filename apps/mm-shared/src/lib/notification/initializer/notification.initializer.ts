import { NotificationOverlayService } from '../notification-overlay.service';

export function initNotificationOverlay(
		overlayService: NotificationOverlayService
) {
	return () => overlayService.attach();
}