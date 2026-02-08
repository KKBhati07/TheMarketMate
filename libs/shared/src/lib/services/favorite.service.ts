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

	setFavorite(listingId: number, isFavorite: boolean): Observable<ApiHttpResponse<ApiResponse<{ is_favorite: boolean }>>> {
		return this.apiService.put(`${AppUrls.API.V1.FAVORITE.SET}/${listingId}`, { is_favorite: isFavorite });
	}
}