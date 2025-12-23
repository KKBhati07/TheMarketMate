import { Injectable } from "@angular/core";
import { ApiService } from "mm-shared";
import { Observable, tap } from "rxjs";
import { ApiHttpResponse } from "mm-shared";
import { ApiResponse } from "mm-shared";
import { AppUrls } from "../app.urls";
import { shareReplay } from "rxjs/operators";

@Injectable({
	providedIn: 'root'
})
export class CategoryService {
	constructor(private apiService: ApiService) {
	}

	private categories$: Observable<ApiHttpResponse<ApiResponse<any>>> | null = null;

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
