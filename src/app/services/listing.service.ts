import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { AppUrls } from '../app.urls';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { ApiHttpResponse } from '../app-util/api-response.util';
import { ListingResponse } from '../models/listing.model';

@Injectable({
	providedIn: 'root',
})
export class ListingService {
	constructor(private apiService: ApiService) {}

	createListing(data: FormData): Observable<ApiHttpResponse<ApiResponse<any>>> {
		return this.apiService.post(AppUrls.API.V1.LISTING.CREATE, data)
	}

	getAll(queryParams: Record<string, any>, page?: number): Observable<ApiHttpResponse<ApiResponse<ListingResponse>>> {
		return this.apiService.get(AppUrls.API.V1.LISTING.GET_ALL, page ? { ...queryParams, page } : queryParams)
	}

	getByUser(uuid: string, page: number = 0): Observable<ApiHttpResponse<ApiResponse<ListingResponse>>> {
		return this.apiService.get(AppUrls.API.V1.LISTING.GET_BY_USER, { user: uuid, page })
	}
}