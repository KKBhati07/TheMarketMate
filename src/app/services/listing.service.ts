import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { AppUrls } from '../app.urls';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { ApiHttpResponse } from '../app-util/api-response.util';

@Injectable({
	providedIn: 'root',
})
export class ListingService {
	constructor(private apiService: ApiService) { }

	createListing(data:FormData): Observable<ApiHttpResponse<ApiResponse<any>>>{
		return this.apiService.post(AppUrls.API.V1.LISTING.CREATE,data)
	}
}