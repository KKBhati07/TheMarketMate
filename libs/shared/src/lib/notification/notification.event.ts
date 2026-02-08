import { NotificationPayload } from './notification.model';

export type NotificationEvent =
		| { type: 'SHOW'; payload: NotificationPayload }
		| { type: 'DISMISS'; id: string }
		| { type: 'CLEAR_ALL' };
