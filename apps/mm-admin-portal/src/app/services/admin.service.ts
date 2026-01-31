import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiHttpResponse } from 'mm-shared';
import { ApiResponse,
	PaginatedResponse,
	UserDetailsDto,
	UpdateUserResponse } from 'mm-shared';
import { ListingResponse } from 'mm-shared';
import { AppUrls } from '../utils/app.urls';
import { ApiService } from 'mm-shared';

@Injectable({
	providedIn: 'root',
})
export class AdminService {
	constructor(private readonly apiService: ApiService) {
	}

	updateUser(data: FormData): Observable<ApiHttpResponse<ApiResponse<UpdateUserResponse>>> {
		return this.apiService.put(AppUrls.API.V1.ADMIN.USERS.UPDATE, data)
	}

	getAllUsers(page?: number): Observable<ApiHttpResponse<ApiResponse<PaginatedResponse<UserDetailsDto>>>> {
		return this.apiService.get(AppUrls.API.V1.ADMIN.USERS.GET_ALL, page !== undefined ? { page } : {})
	}

	deleteUser(uuid: string): Observable<ApiHttpResponse<void>> {
		return this.apiService.delete(AppUrls.API.V1.ADMIN.USERS.DELETE(uuid))
	}

	restoreUser(uuid: string): Observable<ApiHttpResponse<void>> {
		return this.apiService.patch(AppUrls.API.V1.ADMIN.USERS.RESTORE(uuid), { restore: true })
	}

	getAllListings(queryParams: Record<string, string | number | boolean>, page?: number): Observable<ApiHttpResponse<ApiResponse<ListingResponse>>> {
		return this.apiService.get(AppUrls.API.V1.ADMIN.LISTINGS.GET_ALL, page ? { ...queryParams, page } : queryParams)
	}

	deleteListings(listingIds: number[]): Observable<ApiHttpResponse<void>> {
		return this.apiService.delete(AppUrls.API.V1.ADMIN.LISTINGS.DELETE, { 'listing_ids': listingIds })
	}
}