import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { AppUrls } from '../common.urls';
import { ApiHttpResponse } from '../utils/api-response.util';
import { ApiResponse } from '../models/api-response.model';
import { Observable } from 'rxjs';

@Injectable()
export class FavoriteService {
	constructor(private readonly apiService: ApiService) {
	}

	setUnsetFavorite(listingId: number): Observable<ApiHttpResponse<ApiResponse<{ is_favorite: boolean }>>> {
		return this.apiService.post(AppUrls.API.V1.FAVORITE.SET_UNSET, { listing_id: listingId });
	}
}