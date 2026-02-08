import { Injectable } from '@angular/core';
import { LogContext, writeLog } from '../utils/logging.util';

@Injectable({ providedIn: 'root' })
export class LoggingService {
	debug(message: string, context?: LogContext): void {
		writeLog('debug', message, undefined, context);
	}

	info(message: string, context?: LogContext): void {
		writeLog('info', message, undefined, context);
	}

	warn(message: string, context?: LogContext): void {
		writeLog('warn', message, undefined, context);
	}

	error(message: string, error?: unknown, context?: LogContext): void {
		writeLog('error', message, error, context);
	}
}