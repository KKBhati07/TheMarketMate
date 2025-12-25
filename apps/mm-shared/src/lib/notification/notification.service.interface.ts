import { NotificationPayload } from './notification.model';

export interface NotificationServiceContract {
	success(payload: Omit<NotificationPayload, 'type'>): void;
	error(payload: Omit<NotificationPayload, 'type'>): void;
	warning(payload: Omit<NotificationPayload, 'type'>): void;
	info(payload: Omit<NotificationPayload, 'type'>): void;
	loading(payload: Omit<NotificationPayload, 'type'>): void;
	dismiss(id: string): void;
	clearAll(): void;
}
