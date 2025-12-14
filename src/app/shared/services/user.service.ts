import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { Observable } from "rxjs";
import { ApiResponse } from "../models/api-response.model";
import { ApiHttpResponse } from "../../app-util/api-response.util";
import { AppUrls } from "../../app.urls";
import { UpdateUserPayload } from '../models/user.model';

@Injectable({
	providedIn: "root",
})

export class UserService {
	constructor(private apiService: ApiService) {
	}

	getDetails(uuid: string): Observable<ApiHttpResponse<ApiResponse<any>>> {
		return this.apiService.get(AppUrls.API.V1.USER.USER_DETAILS(uuid))
	}

	updateUser(data: UpdateUserPayload): Observable<ApiHttpResponse<ApiResponse<any>>> {
		return this.apiService.put(AppUrls.API.V1.USER.UPDATE_USER, data)
	}

	uploadImageFallback(data: FormData): Observable<ApiHttpResponse<void>> {
		return this.apiService.patch(AppUrls.API.V1.USER.UPLOAD_IMAGE_FALLBACK, data)
	}

}
