import { Injectable } from "@angular/core";
import { ApiService } from "mm-shared";
import { Observable } from "rxjs";
import { ApiResponse } from "mm-shared";
import { ApiHttpResponse } from "mm-shared";
import { AppUrls } from "../app.urls";
import { UpdateUserPayload } from 'mm-shared';

/**
 * Service for managing user profile operations.
 * 
 * Handles user profile retrieval, updates, and image uploads.
 */
@Injectable({
	providedIn: "root",
})

export class UserService {
	constructor(private apiService: ApiService) {
	}

	/**
	 * Gets user profile details by UUID.
	 * 
	 * @param uuid - User UUID
	 * @returns Observable of the API response containing user details
	 */
	getDetails(uuid: string): Observable<ApiHttpResponse<ApiResponse<any>>> {
		return this.apiService.get(AppUrls.API.V1.USER.USER_DETAILS(uuid))
	}

	/**
	 * Updates user profile information.
	 * 
	 * @param data - Update payload containing fields to update (name, email, contact_no, profileImage)
	 * @returns Observable of the API response
	 */
	updateUser(data: UpdateUserPayload): Observable<ApiHttpResponse<ApiResponse<any>>> {
		return this.apiService.put(AppUrls.API.V1.USER.UPDATE_USER, data)
	}

	/**
	 * Uploads user profile image using fallback method.
	 * 
	 * @param data - FormData containing the image file
	 * @returns Observable of the API response
	 */
	uploadImageFallback(data: FormData): Observable<ApiHttpResponse<void>> {
		return this.apiService.patch(AppUrls.API.V1.USER.UPLOAD_IMAGE_FALLBACK, data)
	}

}
