import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiHttpResponse, apiResponse } from '../utils/api-response.util';
import { SHARED_LIB_CONFIG, SharedLibConfig } from '../utils/tokens.util';

/**
 * Centralizes HTTP request handling with consistent error normalization.
 * 
 * Wraps all responses in ApiHttpResponse to prevent HTTP errors from throwing
 * and allows uniform error handling across the application. All requests include
 * credentials to maintain session state via cookies.
 */
@Injectable()
export class ApiService {
	protected baseUrl: string;

	constructor(
			private readonly http: HttpClient,
			@Inject(SHARED_LIB_CONFIG) private readonly config: SharedLibConfig
	) {
		this.baseUrl = this.config.apiUrl;
	}


	private getAuthHeaders(): HttpHeaders {
		return new HttpHeaders();
	}

	get<T>(endpoint: string, queryParams?: Record<string, string | number | boolean>)
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
