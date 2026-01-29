import { AuthService } from "../services/auth.service";
import { bootstrapLogger } from '../utils/bootstrap-logger.util';

/**
 * Factory function for creating the authentication initializer.
 * 
 * Loads user authentication details on application startup.
 * If loading fails, logs the error but does not prevent app initialization.
 * 
 * @param authService - The AuthService instance to use for loading user details
 * @returns A function that returns a Promise resolving when initialization completes
 */
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
