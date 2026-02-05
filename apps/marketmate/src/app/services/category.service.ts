import { Injectable } from "@angular/core";
import { ApiService } from "@marketmate/shared";
import { Observable, tap } from "rxjs";
import { ApiHttpResponse } from "@marketmate/shared";
import { ApiResponse, CategoriesResponse } from "@marketmate/shared";
import { AppUrls } from "../app.urls";
import { shareReplay } from "rxjs/operators";

/**
 * Caches categories using shareReplay to avoid redundant API calls.
 * Cache is cleared on failure to allow retry on subsequent calls.
 */
@Injectable({
	providedIn: 'root'
})
export class CategoryService {
	constructor(private readonly apiService: ApiService) {
	}

	private categories$: Observable<ApiHttpResponse<ApiResponse<CategoriesResponse>>> | null = null;

	getCategories(): Observable<ApiHttpResponse<ApiResponse<CategoriesResponse>>> {
		if (this.categories$) return this.categories$;
		this.categories$ = this.apiService
				.get<ApiResponse<CategoriesResponse>>(AppUrls.API.V1.CATEGORY.GET_ALL)	
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
