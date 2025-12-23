import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

import { NotificationPayload } from './notification.model';
import { NotificationEvent } from './notification.event';
import { DEFAULT_NOTIFICATION_CONFIG } from './notification.config';
import { NotificationServiceContract } from './notification.service.interface';

@Injectable({
	providedIn: 'root',
})
export class NotificationService implements NotificationServiceContract {
	private readonly event$ = new Subject<NotificationEvent>();

	getEvent(): Observable<NotificationEvent> {
		return this.event$.asObservable()
	}

	success(payload: Omit<NotificationPayload, 'type'>): void {
		this.emit({ ...payload, type: 'success', title: payload.title ?? 'Success' });
	}

	error(payload: Omit<NotificationPayload, 'type'>): void {
		this.emit({ ...payload, type: 'error', title: payload.title ?? 'Error' });
	}

	warning(payload: Omit<NotificationPayload, 'type'>): void {
		this.emit({ ...payload, type: 'warning', title: payload.title ?? 'Warning' });
	}

	info(payload: Omit<NotificationPayload, 'type'>): void {
		this.emit({ ...payload, type: 'info', title: payload.title ?? 'Info' });
	}

	loading(payload: Omit<NotificationPayload, 'type'>): void {
		this.emit({ ...payload, type: 'loading', title: payload.title ?? 'Loading' });
	}

	dismiss(id: string): void {
		this.event$.next({
			type: 'DISMISS',
			id,
		});
	}

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
