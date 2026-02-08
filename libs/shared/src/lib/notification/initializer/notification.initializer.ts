import { NotificationOverlayService } from '../notification-overlay.service';

export function initNotificationOverlay(
		overlayService: NotificationOverlayService
): () => void {
	return () => overlayService.attach();
}