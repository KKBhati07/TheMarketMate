import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NotificationPayload } from '../../notification.model';
import { toastAnimation } from '../../notification.animation';
import { NotificationType } from '../../notification.type';

@Component({
	selector: 'mm-notification-toast',
	templateUrl: './notification-toast.component.html',
	styleUrls: ['./notification-toast.component.scss'],
	animations: [toastAnimation],
})
export class NotificationToastComponent {
	@Input('notification') set setData(data: NotificationPayload) {
		this.notification = data;
		this.setIconAndColor(data.type);
	}

	iconColor: string = '#22c55e';
	icon: string = 'check_circle';
	notification!: NotificationPayload;
	@Output() dismiss = new EventEmitter<void>();

	setIconAndColor(type: NotificationType) {
		switch (type) {
			case 'success':
				this.icon = 'check_circle'
				this.iconColor = '#22c55e'
				break;

			case 'error':
				this.icon = 'error'
				this.iconColor = '#ef4444'
				break;

			case 'warning':
				this.icon = 'warning'
				this.iconColor = '#f59e0b'
				break;

			case 'info':
				this.icon = 'info'
				this.iconColor = '#3b82f6'
				break;

			default:
				this.icon = 'check_circle'
				this.iconColor = '#22c55e'
				break;
		}
	}
}