import { Injectable } from "@angular/core";
import { ApiService } from "mm-shared";
import { Observable, tap } from "rxjs";
import { ApiHttpResponse } from "mm-shared";
import { ApiResponse } from "mm-shared";
import { AppUrls } from "../app.urls";
import { shareReplay } from "rxjs/operators";

/**
 * Service for managing category data.
 * 
 * Provides cached access to marketplace categories. Categories are fetched
 * once and cached using shareReplay for efficient reuse across components.
 * Cache is cleared on fetch failure to allow retry.
 */
@Injectable({
	providedIn: 'root'
})
export class CategoryService {
	constructor(private apiService: ApiService) {
	}

	private categories$: Observable<ApiHttpResponse<ApiResponse<any>>> | null = null;

	/**
	 * Gets all marketplace categories.
	 * 
	 * Results are cached after first fetch. Cache is cleared if the request fails,
	 * allowing retry on subsequent calls.
	 * 
	 * @returns Observable of the API response containing categories (cached)
	 */
	getCategories(): Observable<ApiHttpResponse<ApiResponse<any>>> {
		if (this.categories$) return this.categories$;
		this.categories$ = this.apiService
				.get<ApiResponse<any>>(AppUrls.API.V1.CATEGORY.GET_ALL)	
				.pipe(
						shareReplay(1),
						tap(res => {
							if (!res.isSuccessful()) {
								this.categories$ = null;
							}
						}),
				);
		return this.categories$;
	}
}
