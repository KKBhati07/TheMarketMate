import { Injectable } from '@angular/core';
import { ApiService } from 'mm-shared';
import { AppUrls } from '../app.urls';
import { Observable } from 'rxjs';
import { ApiResponse } from 'mm-shared';
import { ApiHttpResponse } from 'mm-shared';
import { CreateListingPayload, ListingResponse } from '../models/listing.model';

@Injectable({
	providedIn: 'root',
})
export class ListingService {
	constructor(private readonly apiService: ApiService) {
	}

	createListing(data: CreateListingPayload): Observable<ApiHttpResponse<ApiResponse<{ id: number }>>> {
		return this.apiService.post(AppUrls.API.V1.LISTING.CREATE, data)
	}

	uploadImageFallback(data: FormData): Observable<ApiHttpResponse<void>> {
		return this.apiService.patch(AppUrls.API.V1.LISTING.IMAGE_UPLOAD_FALLBACK, data)
	}

	getAll(queryParams: Record<string, string | number | boolean>, page?: number): Observable<ApiHttpResponse<ApiResponse<ListingResponse>>> {
		return this.apiService.get(AppUrls.API.V1.LISTING.GET_ALL, page ? { ...queryParams, page } : queryParams)
	}

	getByUser(uuid: string, page: number = 0): Observable<ApiHttpResponse<ApiResponse<ListingResponse>>> {
		return this.apiService.get(AppUrls.API.V1.LISTING.GET_BY_USER, { user: uuid, page })
	}

	getFavoriteByUser(uuid: string, page: number = 0): Observable<ApiHttpResponse<ApiResponse<ListingResponse>>> {
		return this.apiService.get(AppUrls.API.V1.LISTING.GET_FAVORITES, { user: uuid, page })
	}
}