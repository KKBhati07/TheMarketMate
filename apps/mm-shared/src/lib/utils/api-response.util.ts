import { map, of, catchError, Observable } from "rxjs";
import { HttpErrorResponse, HttpEventType, HttpResponse } from "@angular/common/http";

/**
 * Extended HTTP response interface with success checking method.
 * 
 * Adds an `isSuccessful()` method to Angular's HttpResponse for easier
 * status code checking (200-299 range).
 */
export interface ApiHttpResponse<T> extends HttpResponse<T> {
	/**
	 * Checks if the HTTP response status indicates success (200-299).
	 * 
	 * @returns True if status is in the 200-299 range, false otherwise
	 */
	isSuccessful(): boolean;
}

/**
 * Wraps an HTTP response Observable to add success checking and error handling.
 * 
 * Converts standard HttpResponse to ApiHttpResponse with isSuccessful() method.
 * Catches HTTP errors and converts them to ApiHttpResponse with isSuccessful() = false.
 * 
 * @param response$ - Observable of HTTP response
 * @returns Observable of ApiHttpResponse with success checking capability
 */
export function apiResponse<T>(response$: Observable<HttpResponse<T>>): Observable<ApiHttpResponse<T>> {
	return response$.pipe(
			map((response: HttpResponse<T>) => ({
				...response.clone(),
				isSuccessful: () => response.status >= 200 && response.status < 300
			}) as ApiHttpResponse<T>),
			catchError((error: HttpErrorResponse) => {
				const errorResponse: ApiHttpResponse<T> = {
					body: error.error ?? null,
					headers: error.headers,
					status: error.status || 500,
					statusText: error.statusText || "Unknown Error",
					url: error.url || null,
					ok: false,
					type: HttpEventType.Response,
					clone: () => error as any,
					isSuccessful: () => false
				};

				return of(errorResponse);
			})
	);
}
