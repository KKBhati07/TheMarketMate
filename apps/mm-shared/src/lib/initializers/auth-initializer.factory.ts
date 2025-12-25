import { AuthService } from "../services/auth.service";

export function authInitializerFactory(authService: AuthService): () => Promise<void> {
	return () => {
		return new Promise((resolve, reject) => {
			authService.loadUserDetails().subscribe({
				next: () => resolve(),
				error: (error) => {
					console.error('Error loading user details on app startup:', error);
					resolve();
				}
			});
		});
	};
}
