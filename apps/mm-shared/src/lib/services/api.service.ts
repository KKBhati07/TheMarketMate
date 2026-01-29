import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiHttpResponse, apiResponse } from '../utils/api-response.util';
import { SHARED_LIB_CONFIG, SharedLibConfig } from '../utils/tokens.util';

/**
 * Base HTTP service for making API requests.
 * 
 * Provides methods for all HTTP verbs (GET, POST, PUT, PATCH, DELETE)
 * with automatic error handling and response wrapping.
 * All requests include credentials (cookies) for authentication.
 */
@Injectable()
export class ApiService {
	protected baseUrl: string;

	constructor(
			private http: HttpClient,
			@Inject(SHARED_LIB_CONFIG) config: SharedLibConfig
	) {
		this.baseUrl = config.apiUrl;
	}


	private getAuthHeaders(): HttpHeaders {
		return new HttpHeaders();
	}

	/**
	 * Performs a GET request to the specified endpoint.
	 * 
	 * @param endpoint - The API endpoint path (relative to baseUrl)
	 * @param queryParams - Optional query parameters as key-value pairs
	 * @returns Observable of the HTTP response wrapped in ApiHttpResponse`
	 */
	get<T>(endpoint: string, queryParams?: Record<string, any>)
			: Observable<ApiHttpResponse<T>> {
		const headers = this.getAuthHeaders();

		let url = `${ this.baseUrl }${ endpoint }`;
		if (queryParams && Object.keys(queryParams).length > 0) {
			const queryString = new URLSearchParams(
					Object.entries(queryParams)
							.filter(([_, value]) => value !== undefined && value !== null)
							.map(([key, value]) => [key, String(value)])
			).toString();

			url += `?${ queryString }`;
		}

		return apiResponse(
				this.http.get<T>(url, { headers, observe: 'response', withCredentials:true })
		);
	}

	/**
	 * Performs a POST request to the specified endpoint.
	 * 
	 * @param endpoint - The API endpoint path (relative to baseUrl)
	 * @param body - The request body to send
	 * @param extraHeaders - Optional additional HTTP headers
	 * @returns Observable of the HTTP response wrapped in ApiHttpResponse
	 */
	post<T>(endpoint: string, body: any, extraHeaders?:Record<string, string>): Observable<ApiHttpResponse<T>> {
		let headers = this.getAuthHeaders();
		if (extraHeaders) {
			Object.entries(extraHeaders).forEach(([key, value]) => {
				headers = headers.set(key, value);
			});
		}

		return apiResponse(
				this.http.post<T>(`${ this.baseUrl }${ endpoint }`,
						body,
						{
							headers,
							observe: 'response',
							withCredentials: true
						}
				)
		);
	}

	/**
	 * Performs a PUT request to the specified endpoint.
	 * 
	 * @param endpoint - The API endpoint path (relative to baseUrl)
	 * @param body - The request body to send
	 * @returns Observable of the HTTP response wrapped in ApiHttpResponse
	 */
	put<T>(endpoint: string, body: any): Observable<ApiHttpResponse<T>> {
		const headers = this.getAuthHeaders();
		return apiResponse(
				this.http.put<T>(`${ this.baseUrl }${ endpoint }`, body, {
					headers,
					observe: 'response',
					withCredentials: true
				})
		);
	}

	/**
	 * Performs a PATCH request to the specified endpoint.
	 * 
	 * @param endpoint - The API endpoint path (relative to baseUrl)
	 * @param body - The request body to send (partial update)
	 * @returns Observable of the HTTP response wrapped in ApiHttpResponse
	 */
	patch<T>(endpoint: string, body: any): Observable<ApiHttpResponse<T>> {
		const headers = this.getAuthHeaders();
		return apiResponse(
				this.http.patch<T>(`${ this.baseUrl }${ endpoint }`, body, {
					headers,
					observe: 'response',
					withCredentials: true
				})
		);
	}

	/**
	 * Performs a DELETE request to the specified endpoint.
	 * 
	 * @param endpoint - The API endpoint path (relative to baseUrl)
	 * @param body - Optional request body (some APIs require body for DELETE)
	 * @returns Observable of the HTTP response wrapped in ApiHttpResponse
	 */
	delete<T>(endpoint: string, body?: any): Observable<ApiHttpResponse<T>> {
		const headers: HttpHeaders = this.getAuthHeaders();

		const options: {
			headers: HttpHeaders;
			observe: 'response';
			withCredentials: boolean;
			body?: any;
		} = {
			headers,
			observe: 'response',
			withCredentials: true
		};

		if (body) {
			options.body = body;
		}
		return apiResponse(
				this.http.delete<T>(`${ this.baseUrl }${ endpoint }`, options)
		);
	}
}
