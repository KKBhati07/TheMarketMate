import { ThemeService } from '../services/app-theme.service';
import { bootstrapLogger } from '../utils/bootstrap-logger.util';

/**
 * Synchronous initialization wrapped in try-catch to prevent theme errors
 * from blocking app startup. Falls back gracefully if localStorage is unavailable.
 */
export function themeInitializerFactory(themeService: ThemeService): () => Promise<void> {
	return () => {
		try {
			themeService.init();
		} catch (err) {
			bootstrapLogger.warn('Theme initialization failed', { err });
		}
		return Promise.resolve();
	};
}