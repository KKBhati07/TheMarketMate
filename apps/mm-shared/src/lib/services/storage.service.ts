import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { AppUrls } from '../common.urls';
import { PresignRequestPayload, PresignResponse } from '../models/storage.model';
import { from, Observable, retry, timer } from 'rxjs';
import { ApiHttpResponse } from '../utils/api-response.util';
import { ApiResponse } from '../models/api-response.model';

/**
 * Service for managing file storage operations with S3.
 * 
 * Handles presigned URL generation, file uploads, and object existence checks.
 * Includes automatic retry logic for uploads with exponential backoff.
 */
@Injectable()
export class StorageService {
	constructor(private readonly apiService: ApiService) {
	}

	/**
	 * Gets a presigned PUT URL for uploading a file to S3.
	 * 
	 * @param payload - Request payload containing file metadata
	 * @returns Observable of the API response containing presigned URLs
	 */
	getPresignPutUrl(payload: PresignRequestPayload): Observable<ApiHttpResponse<ApiResponse<PresignResponse>>> {
		return this.apiService.post(AppUrls.API.V1.STORAGE.PRESIGN_URL, payload);
	}

	/**
	 * Checks if an object exists in S3 storage.
	 * 
	 * @param objectKey - The S3 object key to check
	 * @returns Observable of the API response with existence status
	 */
	checkObjectExists(objectKey: string)
			: Observable<ApiHttpResponse<ApiResponse<{ exists: boolean }>>> {
		return this.apiService.get(AppUrls.API.V1.STORAGE.OBJECT_EXISTS, { object_key: objectKey });
	}

	/**
	 * Uploads a file directly to S3 using a presigned URL.
	 * 
	 * Includes automatic retry logic (3 attempts) with exponential backoff and jitter.
	 * 
	 * @param uploadUrl - The presigned S3 PUT URL
	 * @param file - The file to upload
	 * @param headers - Required headers for the S3 upload (from presigned URL response)
	 * @returns Observable that completes when upload succeeds, errors on failure
	 */
	uploadFileToS3(uploadUrl: string, file: File, headers: Record<string, string>): Observable<void> {
		return from((async () => {
			const resp = await fetch(uploadUrl, {
				method: 'PUT',
				headers,
				body: file
			});

			if (!resp.ok) {
				const text = await resp.text();
				throw new Error(`S3 upload failed: ${ resp.status } ${ resp.statusText } - ${ text }`);
			}
			return;
		})()).pipe(
				retry({
					count: 3,
					delay: retryIndex => {
						const base = (retryIndex + 1) * 500;
						const jitter = Math.floor(Math.random() * 200);
						return timer(base + jitter);
					}
				})
		);
	}
}