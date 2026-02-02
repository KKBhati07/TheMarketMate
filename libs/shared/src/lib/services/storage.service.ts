import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { AppUrls } from '../common.urls';
import { PresignRequestPayload, PresignResponse } from '../models/storage.model';
import { from, Observable, retry, timer } from 'rxjs';
import { ApiHttpResponse } from '../utils/api-response.util';
import { ApiResponse } from '../models/api-response.model';

@Injectable()
export class StorageService {
	constructor(private readonly apiService: ApiService) {
	}

	getPresignPutUrl(payload: PresignRequestPayload): Observable<ApiHttpResponse<ApiResponse<PresignResponse>>> {
		return this.apiService.post(AppUrls.API.V1.STORAGE.PRESIGN_URL, payload);
	}

	checkObjectExists(objectKey: string)
			: Observable<ApiHttpResponse<ApiResponse<{ exists: boolean }>>> {
		return this.apiService.get(AppUrls.API.V1.STORAGE.OBJECT_EXISTS, { object_key: objectKey });
	}

	/**
	 * Retries failed uploads with exponential backoff and jitter to handle
	 * transient network issues and S3 rate limiting. Jitter prevents thundering herd
	 * when multiple uploads fail simultaneously.
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