import { ThemeService } from '../services/app-theme.service';
import { bootstrapLogger } from '../utils/bootstrap-logger.util';

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