import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { ApiHttpResponse, apiResponse } from '../app-util/api-response.util';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  protected baseUrl = environment.apiUrl;

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  private getAuthHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    const cookie = this.cookieService.get('sessionid');
    if (cookie) {
      headers = headers.set('sessionid', cookie);
    }
    return headers;
  }

  get<T>(endpoint: string): Observable<ApiHttpResponse<T>> {
    const headers = this.getAuthHeaders();
    return apiResponse(
      this.http.get<T>(`${this.baseUrl}${endpoint}`, { headers, observe: 'response' })
    );
  }

  post<T>(endpoint: string, body: any): Observable<ApiHttpResponse<T>> {
    const headers = this.getAuthHeaders();
    return apiResponse(
      this.http.post<T>(`${this.baseUrl}${endpoint}`, body, { headers, observe: 'response' })
    );
  }

  put<T>(endpoint: string, body: any): Observable<ApiHttpResponse<T>> {
    const headers = this.getAuthHeaders();
    return apiResponse(
      this.http.put<T>(`${this.baseUrl}${endpoint}`, body, { headers, observe: 'response' })
    );
  }

  delete<T>(endpoint: string): Observable<ApiHttpResponse<T>> {
    const headers = this.getAuthHeaders();
    return apiResponse(
      this.http.delete<T>(`${this.baseUrl}${endpoint}`, { headers, observe: 'response' })
    );
  }
}
