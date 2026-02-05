import { isDevMode } from '@angular/core';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';
export type LogContext = Record<string, unknown>;

export function writeLog(
		level: LogLevel,
		message: string,
		error?: unknown,
		context?: LogContext
): void {
	const payload = context ? { ...context } : undefined;

	if (isDevMode()) {
		const sink = console[level] ?? console.log;

		if (error !== undefined && payload !== undefined) sink(message, error, payload);
		else if (error !== undefined) sink(message, error);
		else if (payload !== undefined) sink(message, payload);
		else sink(message);
	}
}
