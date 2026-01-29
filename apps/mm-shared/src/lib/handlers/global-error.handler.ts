import { ErrorHandler, Injectable, inject, isDevMode } from '@angular/core';
import { NotificationService } from '../notification';
import { LoggingService } from '../services/logging.service';

/**
 * Global error handler for unhandled application errors.
 *
 * Catches runtime errors that are not handled by HTTP interceptors
 * or component error handling. Acts as a safety net to prevent
 * white-screen crashes and provides user feedback.
 * 
 * Automatically logs errors in development mode and shows user-friendly
 * error notifications.
 */
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
	private readonly notificationService = inject(NotificationService);
	private readonly logger = inject(LoggingService);

	/**
	 * Handles unhandled errors from the Angular error handling system.
	 * 
	 * @param error - The unhandled error object
	 */
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