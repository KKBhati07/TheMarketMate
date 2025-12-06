import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { ApiHttpResponse, apiResponse } from '../../app-util/api-response.util';

@Injectable({
	providedIn: 'root',
})
export class ApiService {
	protected baseUrl = environment.apiUrl;

	constructor(private http: HttpClient, private cookieService: CookieService) {
	}

	private getAuthHeaders(): HttpHeaders {
		let headers = new HttpHeaders();
		const cookie = this.cookieService.get('sessionid')?.trim();
		if (cookie) {
			headers = headers.set('sessionid', cookie);
		}
		return headers;
	}

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
				this.http.get<T>(url, { headers, observe: 'response' })
		);
	}

	post<T>(endpoint: string, body: any): Observable<ApiHttpResponse<T>> {
		const headers = this.getAuthHeaders();
		return apiResponse(
				this.http.post<T>(`${ this.baseUrl }${ endpoint }`, body, { headers, observe: 'response' })
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
