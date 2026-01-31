/**
 * Standardized API response wrapper for structure for consistent
 * response handling across the application.
 */
export interface ApiResponse<T> {
	/** Indicates whether the request was successful */
	success: boolean;
	/** The response data payload */
	data: T;
	/** Optional message describing the response */
	message?: string;
	/** Timestamp when the response was generated (ISO 8601 string) */
	timestamp?: string;
	/** Optional metadata map for additional response information */
	metadata?: Record<string, any>;
}
