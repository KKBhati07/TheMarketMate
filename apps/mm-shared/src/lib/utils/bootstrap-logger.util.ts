import { LogContext, writeLog } from './logging.util';

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
