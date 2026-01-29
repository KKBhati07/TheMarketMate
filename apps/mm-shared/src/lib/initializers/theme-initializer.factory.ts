import { ThemeService } from '../services/app-theme.service';
import { bootstrapLogger } from '../utils/bootstrap-logger.util';

/**
 * Factory function for creating the theme initializer.
 * 
 * Initializes the application theme (light/dark) on startup based on
 * user preference stored in localStorage. Falls back to light theme if
 * no preference is found or initialization fails.
 * 
 * @param themeService - The ThemeService instance to use for theme initialization
 * @returns A function that returns a Promise resolving when initialization completes
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