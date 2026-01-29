import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

import { NotificationPayload } from './notification.model';
import { NotificationEvent } from './notification.event';
import { DEFAULT_NOTIFICATION_CONFIG } from './notification.config';
import { NotificationServiceContract } from './notification.service.interface';

/**
 * Service for displaying user notifications/toasts.
 * 
 * Provides methods to show different types of notifications (success, error, warning, info, loading).
 * Notifications are displayed via the NotificationModule component.
 */
@Injectable({
	providedIn: 'root',
})
export class NotificationService implements NotificationServiceContract {
	private readonly event$ = new Subject<NotificationEvent>();

	/**
	 * Gets an observable stream of notification events.
	 * Used internally by NotificationModule to display notifications.
	 * 
	 * @returns Observable of notification events
	 */
	getEvent(): Observable<NotificationEvent> {
		return this.event$.asObservable()
	}

	/**
	 * Shows a success notification.
	 * 
	 * @param payload - Notification payload (message, title, duration, etc.)
	 */
	success(payload: Omit<NotificationPayload, 'type'>): void {
		this.emit({ ...payload, type: 'success', title: payload.title ?? 'Success' });
	}

	/**
	 * Shows an error notification.
	 * 
	 * @param payload - Notification payload (message, title, duration, etc.)
	 */
	error(payload: Omit<NotificationPayload, 'type'>): void {
		this.emit({ ...payload, type: 'error', title: payload.title ?? 'Error' });
	}

	/**
	 * Shows a warning notification.
	 * 
	 * @param payload - Notification payload (message, title, duration, etc.)
	 */
	warning(payload: Omit<NotificationPayload, 'type'>): void {
		this.emit({ ...payload, type: 'warning', title: payload.title ?? 'Warning' });
	}

	/**
	 * Shows an informational notification.
	 * 
	 * @param payload - Notification payload (message, title, duration, etc.)
	 */
	info(payload: Omit<NotificationPayload, 'type'>): void {
		this.emit({ ...payload, type: 'info', title: payload.title ?? 'Info' });
	}

	/**
	 * Shows a loading notification.
	 * 
	 * @param payload - Notification payload (message, title, duration, etc.)
	 */
	loading(payload: Omit<NotificationPayload, 'type'>): void {
		this.emit({ ...payload, type: 'loading', title: payload.title ?? 'Loading' });
	}

	/**
	 * Dismisses a specific notification by ID.
	 * 
	 * @param id - The notification ID to dismiss
	 */
	dismiss(id: string): void {
		this.event$.next({
			type: 'DISMISS',
			id,
		});
	}

	/**
	 * Dismisses all currently displayed notifications.
	 */
	clearAll(): void {
		this.event$.next({
			type: 'CLEAR_ALL',
		});
	}

	private emit(payload: NotificationPayload): void {
		const notification: NotificationPayload = {
			id: payload.id ?? this.generateId(),
			duration:
					payload.duration ?? DEFAULT_NOTIFICATION_CONFIG.duration,
			position:
					payload.position ?? DEFAULT_NOTIFICATION_CONFIG.position,
			...payload,
		};

		this.event$.next({
			type: 'SHOW',
			payload: notification,
		});
	}

	private generateId(): string {
		return crypto.randomUUID();
	}
}
