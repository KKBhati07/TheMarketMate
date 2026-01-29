import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { AppUrls } from '../common.urls';
import { ApiHttpResponse } from '../utils/api-response.util';
import { ApiResponse } from '../models/api-response.model';
import { Observable } from 'rxjs';

/**
 * Service for managing user favorites/bookmarks.
 * 
 * Handles adding and removing listings from user's favorites list.
 */
@Injectable()
export class FavoriteService {
	constructor(private apiService: ApiService) {
	}

	/**
	 * Toggles the favorite status of a listing.
	 * If the listing is not favorited, it will be added.
	 * If it is favorited, it will be removed.
	 * 
	 * @param listingId - The ID of the listing to favorite/unfavorite
	 * @returns Observable of the API response with updated favorite status
	 */
	setUnsetFavorite(listingId: number): Observable<ApiHttpResponse<ApiResponse<{ is_favorite: boolean }>>> {
		return this.apiService.post(AppUrls.API.V1.FAVORITE.SET_UNSET, { listing_id: listingId });
	}
}