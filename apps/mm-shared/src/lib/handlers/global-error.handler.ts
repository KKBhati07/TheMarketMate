import { ErrorHandler, Injectable, inject, isDevMode } from '@angular/core';
import { NotificationService } from '../notification';
import { LoggingService } from '../services/logging.service';

/**
 * Global error handler
 *
 * Purpose:
 * - Catch UNHANDLED runtime errors
 * - Act as a safety net
 * - Prevent white-screen crashes
 */
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
	private readonly notificationService = inject(NotificationService);
	private readonly logger = inject(LoggingService);

	handleError(error: unknown): void {

		if (isDevMode()) {
			this.logger.error('Unhandled application error', error);
		}

		this.notificationService.error({
			title: 'Something went wrong',
			message: 'An unexpected error occurred. Please try again.',
			duration: 6000
		});
	}
}