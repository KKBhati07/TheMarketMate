import { Injectable } from "@angular/core";
import { ApiService } from "mm-shared";
import { Observable } from "rxjs";
import { ApiResponse, UserDetailsResponse, UpdateUserResponse } from "mm-shared";
import { ApiHttpResponse } from "mm-shared";
import { AppUrls } from "../app.urls";
import { UpdateUserPayload } from 'mm-shared';

@Injectable({
	providedIn: "root",
})

export class UserService {
	constructor(private readonly apiService: ApiService) {
	}

	getDetails(uuid: string): Observable<ApiHttpResponse<ApiResponse<UserDetailsResponse>>> {
		return this.apiService.get(AppUrls.API.V1.USER.USER_DETAILS(uuid))
	}

	updateUser(data: UpdateUserPayload): Observable<ApiHttpResponse<ApiResponse<UpdateUserResponse>>> {
		return this.apiService.put(AppUrls.API.V1.USER.UPDATE_USER, data)
	}

	uploadImageFallback(data: FormData): Observable<ApiHttpResponse<void>> {
		return this.apiService.patch(AppUrls.API.V1.USER.UPLOAD_IMAGE_FALLBACK, data)
	}

}
