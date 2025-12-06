import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiHttpResponse } from '../../app-util/api-response.util';
import { ApiResponse } from '../models/api-response.model';
import { ListingResponse } from '../models/listing.model';
import { AppUrls } from '../../app.urls';
import { ApiService } from './api.service';

@Injectable({
	providedIn: 'root',
})
export class AdminService {
	constructor(private apiService: ApiService) {
	}

	updateUser(data: FormData): Observable<ApiHttpResponse<ApiResponse<any>>> {
		return this.apiService.put(AppUrls.API.V1.ADMIN.USERS.UPDATE, data)
	}

	getAllUsers(): Observable<ApiHttpResponse<ApiResponse<any>>> {
		return this.apiService.get(AppUrls.API.V1.ADMIN.USERS.GET_ALL)
	}

	deleteUser(uuid: string): Observable<ApiHttpResponse<void>> {
		return this.apiService.delete(AppUrls.API.V1.ADMIN.USERS.DELETE(uuid))
	}

	restoreUser(uuid: string): Observable<ApiHttpResponse<void>> {
		return this.apiService.patch(AppUrls.API.V1.ADMIN.USERS.RESTORE(uuid), { restore: true })
	}

	getAllListings(queryParams: Record<string, any>, page?: number): Observable<ApiHttpResponse<ApiResponse<ListingResponse>>> {
		return this.apiService.get(AppUrls.API.V1.ADMIN.LISTINGS.GET_ALL, page ? { ...queryParams, page } : queryParams)
	}

	deleteListings(listingIds: number[]): Observable<ApiHttpResponse<void>> {
		return this.apiService.delete(AppUrls.API.V1.ADMIN.LISTINGS.DELETE, { 'listing_ids': listingIds })
	}
}