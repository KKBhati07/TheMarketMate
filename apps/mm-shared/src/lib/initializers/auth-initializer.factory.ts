import { AuthService } from "../services/auth.service";
import { bootstrapLogger } from '../utils/bootstrap-logger.util';

export function authInitializerFactory(authService: AuthService): () => Promise<void> {
	return () => {
		return new Promise((resolve, reject) => {
			authService.loadUserDetails().subscribe({
				next: () => resolve(),
				error: (error) => {
					bootstrapLogger.error('Error loading user details on app startup', error);
					resolve();
				}
			});
		});
	};
}
