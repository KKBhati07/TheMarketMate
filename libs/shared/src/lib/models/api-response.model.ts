/**
 * Standard API response contract shared across frontend and backend.
 */
export interface ApiResponse<T> {
	success: boolean;
	data: T;
	message?: string;
	timestamp?: string;
	metadata?: Record<string, any>;
}
