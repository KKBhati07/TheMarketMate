import { inject, PLATFORM_ID } from '@angular/core';
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpResponse } from '@angular/common/http';
import { isPlatformServer } from '@angular/common';
import { EMPTY, of } from 'rxjs';

export const ssrNoHttpInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
	const platformId = inject(PLATFORM_ID);

	if (isPlatformServer(platformId)) {
		console.log(`[SSR] Blocked API call to: ${req.url}`);

		return of(
				new HttpResponse({
					status: 200,
					body: null,
				})
		);
	}

	return next(req);
};