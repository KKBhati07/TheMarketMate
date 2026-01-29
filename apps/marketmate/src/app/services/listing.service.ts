import { Injectable } from '@angular/core';
import { ApiService } from 'mm-shared';
import { AppUrls } from '../app.urls';
import { Observable } from 'rxjs';
import { ApiResponse } from 'mm-shared';
import { ApiHttpResponse } from 'mm-shared';
import { CreateListingPayload, ListingResponse } from '../models/listing.model';

/**
 * Service for managing marketplace listings.
 * 
 * Handles CRUD operations for listings including creation, retrieval,
 * pagination, and user-specific listing queries.
 */
@Injectable({
	providedIn: 'root',
})
export class ListingService {
	constructor(private apiService: ApiService) {
	}

	/**
	 * Creates a new marketplace listing.
	 * 
	 * @param data - Listing creation payload with title, description, price, etc.
	 * @returns Observable of the API response containing the created listing ID
	 */
	createListing(data: CreateListingPayload): Observable<ApiHttpResponse<ApiResponse<{ id: number }>>> {
		return this.apiService.post(AppUrls.API.V1.LISTING.CREATE, data)
	}

	/**
	 * Uploads listing images using fallback method.
	 * 
	 * @param data - FormData containing image files
	 * @returns Observable of the API response
	 */
	uploadImageFallback(data: FormData): Observable<ApiHttpResponse<void>> {
		return this.apiService.patch(AppUrls.API.V1.LISTING.IMAGE_UPLOAD_FALLBACK, data)
	}

	/**
	 * Gets all listings with optional filtering and pagination.
	 * 
	 * @param queryParams - Filter parameters (category_id, location, price range, etc.)
	 * @param page - Page number for pagination (optional)
	 * @returns Observable of the API response containing paginated listings
	 */
	getAll(queryParams: Record<string, any>, page?: number): Observable<ApiHttpResponse<ApiResponse<ListingResponse>>> {
		return this.apiService.get(AppUrls.API.V1.LISTING.GET_ALL, page ? { ...queryParams, page } : queryParams)
	}

	/**
	 * Gets all listings created by a specific user.
	 * 
	 * @param uuid - User UUID
	 * @param page - Page number for pagination (default: 0)
	 * @returns Observable of the API response containing user's listings
	 */
	getByUser(uuid: string, page: number = 0): Observable<ApiHttpResponse<ApiResponse<ListingResponse>>> {
		return this.apiService.get(AppUrls.API.V1.LISTING.GET_BY_USER, { user: uuid, page })
	}

	/**
	 * Gets all favorite listings for a specific user.
	 * 
	 * @param uuid - User UUID
	 * @param page - Page number for pagination (default: 0)
	 * @returns Observable of the API response containing user's favorite listings
	 */
	getFavoriteByUser(uuid: string, page: number = 0): Observable<ApiHttpResponse<ApiResponse<ListingResponse>>> {
		return this.apiService.get(AppUrls.API.V1.LISTING.GET_FAVORITES, { user: uuid, page })
	}
}