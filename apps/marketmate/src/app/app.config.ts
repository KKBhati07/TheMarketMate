import {
	ApplicationConfig,
	ErrorHandler, inject, provideAppInitializer,
	provideZoneChangeDetection
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from "@angular/common/http";

import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import {
	authInitializerFactory,
	GlobalErrorHandler,
	provideNotification,
	ssrNoHttpInterceptor
} from "@marketmate/shared";
import { AuthService } from "@marketmate/shared";
import { themeInitializerFactory } from '@marketmate/shared';
import { ThemeService } from '@marketmate/shared';
import { provideSharedLib } from '@marketmate/shared';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
	providers: [
		provideHttpClient(withFetch(), withInterceptors([ssrNoHttpInterceptor])),
		provideZoneChangeDetection({ eventCoalescing: true }),
		provideRouter(routes),
			// In case in incremental Hydration
			// event replay for Angular to records that click and plays it back once the component is hydrated.
		provideClientHydration(withEventReplay()),
		provideAnimationsAsync(),

		// 3. LIBRARY CONFIG: must run first to configure ApiService, AuthService, etc.
		...provideSharedLib({
			apiUrl: environment.apiUrl
		}),
		...provideNotification(),

		provideAppInitializer(() => {
			const authService = inject(AuthService);
			return authInitializerFactory(authService)();
		}),

		// Modern Theme Initializer
		provideAppInitializer(() => {
			const themeService = inject(ThemeService);
			return themeInitializerFactory(themeService)();
		}),
		{
			provide: ErrorHandler,
			useClass: GlobalErrorHandler
		}
	]
};