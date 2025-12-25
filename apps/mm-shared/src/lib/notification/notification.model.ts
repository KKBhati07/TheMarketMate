import { NotificationType, NotificationPosition } from './notification.type';

export interface NotificationPayload {
	id?: string;
	type: NotificationType;
	title?: string;
	message: string;
	duration?: number;
	position?: NotificationPosition;
	action?: {
		label: string;
		callback: () => void;
	};
	meta?: Record<string, any>;
}
