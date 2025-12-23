import { Injectable, Injector } from '@angular/core';
import {
	Overlay,
	OverlayRef,
	GlobalPositionStrategy,
} from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';

import { NotificationContainerComponent } from './components/notification-container/notification-container.component';
import { NotificationPosition } from './notification.type';

@Injectable({
	providedIn: 'root',
})
export class NotificationOverlayService {
	private overlayRef: OverlayRef | null = null;

	constructor(
			private overlay: Overlay,
			private injector: Injector
	) {
	}

	attach(position: NotificationPosition = 'top-right'): void {
		if (this.overlayRef) {
			return;
		}

		const positionStrategy = this.getPositionStrategy(position);

		this.overlayRef = this.overlay.create({
			positionStrategy,
			hasBackdrop: false,
			scrollStrategy: this.overlay.scrollStrategies.noop(),
			panelClass: 'mm-notification-panel',
		});

		const portal = new ComponentPortal(
				NotificationContainerComponent,
				null,
				this.injector
		);

		this.overlayRef.attach(portal);
	}

	detach(): void {
		this.overlayRef?.dispose();
		this.overlayRef = null;
	}

	private getPositionStrategy(
			position: NotificationPosition
	): GlobalPositionStrategy {
		const strategy = this.overlay.position().global();

		switch (position) {
			case 'top-left':
				return strategy.top('16px').left('16px');

			case 'top-right':
				return strategy.top('16px').right('16px');

			case 'bottom-left':
				return strategy.bottom('16px').left('16px');

			case 'bottom-right':
				return strategy.bottom('16px').right('16px');

			case 'center':
				return strategy.centerHorizontally().centerVertically();

			default:
				return strategy.top('16px').right('16px');
		}
	}
}
