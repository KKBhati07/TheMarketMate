import { Injectable } from '@angular/core';
import { LogContext, writeLog } from '../utils/logging.util';

/**
 * Centralized logging service for application-wide logging.
 * 
 * Provides structured logging with different severity levels.
 * Logs are written to console in development mode only.
 */
@Injectable({ providedIn: 'root' })
export class LoggingService {
	/**
	 * Logs a debug message.
	 * 
	 * @param message - The debug message to log
	 * @param context - Optional context object with additional metadata
	 */
	debug(message: string, context?: LogContext): void {
		writeLog('debug', message, undefined, context);
	}

	/**
	 * Logs an informational message.
	 * 
	 * @param message - The info message to log
	 * @param context - Optional context object with additional metadata
	 */
	info(message: string, context?: LogContext): void {
		writeLog('info', message, undefined, context);
	}

	/**
	 * Logs a warning message.
	 * 
	 * @param message - The warning message to log
	 * @param context - Optional context object with additional metadata
	 */
	warn(message: string, context?: LogContext): void {
		writeLog('warn', message, undefined, context);
	}

	/**
	 * Logs an error message with optional error object.
	 * 
	 * @param message - The error message to log
	 * @param error - Optional error object or exception
	 * @param context - Optional context object with additional metadata
	 */
	error(message: string, error?: unknown, context?: LogContext): void {
		writeLog('error', message, error, context);
	}
}