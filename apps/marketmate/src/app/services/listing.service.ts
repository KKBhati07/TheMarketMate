import { Injectable } from '@angular/core';
import { ApiService, Listing, PaginatedResponse, ConditionsResponse } from '@marketmate/shared';
import { AppUrls } from '../app.urls';
import { Observable, tap } from 'rxjs';
import { ApiResponse, ApiHttpResponse } from '@marketmate/shared';
import { CreateListingPayload } from '../models/listing.model';
import { shareReplay } from 'rxjs/operators';
import { ListingDetail } from '../models/listing-detail.model';

@Injectable({
	providedIn: 'root',
})
export class ListingService {
	private conditions$: Observable<ApiHttpResponse<ApiResponse<ConditionsResponse>>> | null = null;

	constructor(private readonly apiService: ApiService) {
	}

	createListing(data: CreateListingPayload): Observable<ApiHttpResponse<ApiResponse<{ id: number }>>> {
		return this.apiService.post(AppUrls.API.V1.LISTING.CREATE, data)
	}

	uploadImageFallback(data: FormData): Observable<ApiHttpResponse<void>> {
		return this.apiService.patch(AppUrls.API.V1.LISTING.IMAGE_UPLOAD_FALLBACK, data)
	}

	getAll(queryParams: Record<string, string | number | boolean>, page?: number):
			Observable<ApiHttpResponse<ApiResponse<PaginatedResponse<Listing>>>> {
		return this.apiService.get(AppUrls.API.V1.LISTING.GET_ALL, page ? { ...queryParams, page } : queryParams)
	}

	getByUser(uuid: string, page: number = 0):
			Observable<ApiHttpResponse<ApiResponse<PaginatedResponse<Listing>>>> {
		return this.apiService.get(AppUrls.API.V1.LISTING.GET_BY_USER, { user: uuid, page })
	}

	getFavoriteByUser(uuid: string, page: number = 0):
			Observable<ApiHttpResponse<ApiResponse<PaginatedResponse<Listing>>>> {
		return this.apiService.get(AppUrls.API.V1.LISTING.GET_FAVORITES, { user: uuid, page })
	}

	getOne(id: number): Observable<ApiHttpResponse<ApiResponse<ListingDetail>>> {
		return this.apiService.get<ApiResponse<ListingDetail>>(AppUrls.API.V1.LISTING.GET_DETAILS(id))
	}

	contactSellerByEmail(listingId: number, payload: { subject: string; body: string; listing_url?: string })
			: Observable<ApiHttpResponse<ApiResponse<null>>> {
		return this.apiService.post<ApiResponse<null>>(AppUrls.API.V1.LISTING.CONTACT_SELLER_EMAIL(listingId), payload)
	}

	/**
	 * Caches conditions using shareReplay.
	 */
	getConditions(): Observable<ApiHttpResponse<ApiResponse<ConditionsResponse>>> {
		if (this.conditions$) return this.conditions$;
		this.conditions$ = this.apiService
				.get<ApiResponse<ConditionsResponse>>(AppUrls.API.V1.LISTING.GET_CONDITIONS)
				.pipe(
						shareReplay(1),
						tap(res => {
							if (!res.isSuccessful()) {
								this.conditions$ = null;
							}
						}),
				);
		return this.conditions$;
	}
}