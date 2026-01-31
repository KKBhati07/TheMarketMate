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

/**
 * Service for admin portal operations.
 *
 * Handles administrative tasks including user management (CRUD operations,
 * restore deleted users) and listing management (view all, bulk delete).
 */
@Injectable({
	providedIn: 'root',
})
export class AdminService {
	constructor(private apiService: ApiService) {
	}

	/**
	 * Updates a user's profile information.
	 *
	 * @param data - FormData containing user update fields
	 * @returns Observable of the API response
	 */
	updateUser(data: FormData): Observable<ApiHttpResponse<ApiResponse<UpdateUserResponse>>> {
		return this.apiService.put(AppUrls.API.V1.ADMIN.USERS.UPDATE, data)
	}

	/**
	 * Gets all users in the system with optional pagination.
	 *
	 * @param page - Page number for pagination (optional)
	 * @returns Observable of the API response containing paginated users list
	 */
	getAllUsers(page?: number): Observable<ApiHttpResponse<ApiResponse<PaginatedResponse<UserDetailsDto>>>> {
		return this.apiService.get(AppUrls.API.V1.ADMIN.USERS.GET_ALL, page !== undefined ? { page } : {})
	}

	/**
	 * Deletes a user by UUID.
	 *
	 * @param uuid - User UUID to delete
	 * @returns Observable of the API response
	 */
	deleteUser(uuid: string): Observable<ApiHttpResponse<void>> {
		return this.apiService.delete(AppUrls.API.V1.ADMIN.USERS.DELETE(uuid))
	}

	/**
	 * Restores a previously deleted user.
	 *
	 * @param uuid - User UUID to restore
	 * @returns Observable of the API response
	 */
	restoreUser(uuid: string): Observable<ApiHttpResponse<void>> {
		return this.apiService.patch(AppUrls.API.V1.ADMIN.USERS.RESTORE(uuid), { restore: true })
	}

	/**
	 * Gets all listings with optional filtering and pagination.
	 *
	 * @param queryParams - Filter parameters (category, location, status, etc.)
	 * @param page - Page number for pagination (optional)
	 * @returns Observable of the API response containing paginated listings
	 */
	getAllListings(queryParams: Record<string, any>, page?: number): Observable<ApiHttpResponse<ApiResponse<ListingResponse>>> {
		return this.apiService.get(AppUrls.API.V1.ADMIN.LISTINGS.GET_ALL, page ? { ...queryParams, page } : queryParams)
	}

	/**
	 * Deletes multiple listings in bulk.
	 *
	 * @param listingIds - Array of listing IDs to delete
	 * @returns Observable of the API response
	 */
	deleteListings(listingIds: number[]): Observable<ApiHttpResponse<void>> {
		return this.apiService.delete(AppUrls.API.V1.ADMIN.LISTINGS.DELETE, { 'listing_ids': listingIds })
	}
}