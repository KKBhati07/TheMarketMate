import { LogContext, writeLog } from './logging.util';

/**
 * Bootstrap logger for use in environments where dependency injection is not available.
 * 
 * Use this logger in:
 * - `main.ts` (application bootstrap)
 * - Server-side rendering files
 * - Module-level initialization code
 * 
 * For components and services, use `LoggingService` instead.
 */
export const bootstrapLogger = {
	debug: (message: string, context?: LogContext): void =>
			writeLog('debug', message, undefined, context),

	info: (message: string, context?: LogContext): void =>
			writeLog('info', message, undefined, context),

	warn: (message: string, context?: LogContext): void =>
			writeLog('warn', message, undefined, context),

	error: (message: string, error?: unknown, context?: LogContext): void =>
			writeLog('error', message, error, context),
};
