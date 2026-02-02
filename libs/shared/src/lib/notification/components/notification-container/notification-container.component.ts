import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

import { NotificationService } from '../../notification.service';
import { NotificationPayload } from '../../notification.model';
import { NotificationEvent } from '../../notification.event';

@Component({
	selector: 'mm-notification-container',
	templateUrl: './notification-container.html',
	styleUrls: ['./notification-container.scss'],
})
export class NotificationContainerComponent implements OnInit, OnDestroy {

	notifications: NotificationPayload[] = [];
	private destroy$: Subject<void> = new Subject<void>();

	constructor(
			private notificationService: NotificationService
	) {
	}

	ngOnInit(): void {
		this.notificationService.getEvent()
				.pipe(takeUntil(this.destroy$))
				.subscribe((event: NotificationEvent) => this.handleEvent(event));
	}

	private handleEvent(event: NotificationEvent): void {
		switch (event.type) {
			case 'SHOW':
				this.add(event.payload);
				break;
			case 'DISMISS':
				this.remove(event.id);
				break;
			case 'CLEAR_ALL':
				this.notifications = [];
				break;
		}
	}

	private add(notification: NotificationPayload): void {
		this.notifications.push(notification);

		if (notification?.duration) {
			setTimeout(() => {
				this.remove(notification.id!);
			}, notification.duration);
		}
	}

	private remove(id: string): void {
		this.notifications =
				this.notifications.filter(n => n.id !== id);
	}

	trackById(_: number, n: NotificationPayload): string {
		return n.id!;
	}

	dismiss(id: string): void {
		this.notificationService.dismiss(id);
	}


	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}
}
