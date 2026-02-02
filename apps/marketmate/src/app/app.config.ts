import {
	APP_INITIALIZER,
	ApplicationConfig,
	ErrorHandler,
	importProvidersFrom,
	provideZoneChangeDetection
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from "@angular/common/http";

import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { authInitializerFactory, GlobalErrorHandler, NotificationModule } from "@marketmate/shared";
import { AuthService } from "@marketmate/shared";
import { themeInitializerFactory } from '@marketmate/shared';
import { ThemeService } from '@marketmate/shared';
import { SharedModule } from '@marketmate/shared';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
	providers: [
		provideHttpClient(withFetch()),
		provideZoneChangeDetection({ eventCoalescing: true }),
		provideRouter(routes),
		provideClientHydration(),
		provideAnimationsAsync(),

		// 3. LIBRARY CONFIG: must run first to configure ApiService, AuthService, etc.
		importProvidersFrom(
				SharedModule.forRoot({
					apiUrl: environment.apiUrl
				}),
				NotificationModule
		),
		{
			provide: APP_INITIALIZER,
			useFactory: authInitializerFactory,
			multi: true,
			// AuthService is safely resolved from the SharedModule.forRoot providers.
			deps: [AuthService]
		},
		{
			provide: APP_INITIALIZER,
			useFactory: themeInitializerFactory,
			multi: true,
			deps: [ThemeService]
		},
		{
			provide: ErrorHandler,
			useClass: GlobalErrorHandler
		}
	]
};