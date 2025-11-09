import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { AppUrls } from '../app.urls';
import { ApiHttpResponse } from '../app-util/api-response.util';
import { ApiResponse } from '../models/api-response.model';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class FavoriteService {
	constructor(private apiService: ApiService) {
	}

	setUnsetFavorite(listingId: number): Observable<ApiHttpResponse<ApiResponse<{is_favorite: boolean}>>>  {
		return this.apiService.post(AppUrls.API.V1.FAVORITE.SET_UNSET,{listing_id: listingId});
	}
}