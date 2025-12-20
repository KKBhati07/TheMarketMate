import { ThemeService } from '../services/app-theme.service';

export function themeInitializerFactory(themeService: ThemeService): () => Promise<void> {
	return () => {
		try {
			themeService.init();
		} catch (err) {
			console.warn('Theme initialization failed:', err);
		}
		return Promise.resolve();
	};
}