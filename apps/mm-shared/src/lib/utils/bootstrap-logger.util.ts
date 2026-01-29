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
	debug: (message: string, context?: LogContext) =>
			writeLog('debug', message, undefined, context),

	info: (message: string, context?: LogContext) =>
			writeLog('info', message, undefined, context),

	warn: (message: string, context?: LogContext) =>
			writeLog('warn', message, undefined, context),

	error: (message: string, error?: unknown, context?: LogContext) =>
			writeLog('error', message, error, context),
};
