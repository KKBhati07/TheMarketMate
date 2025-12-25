import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from "@angular/common/http";

import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { authInitializerFactory, NotificationModule } from "mm-shared";
import { AuthService } from "mm-shared";
import { themeInitializerFactory } from 'mm-shared';
import { ThemeService } from 'mm-shared';
import { SharedModule } from 'mm-shared';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
	providers: [
		provideHttpClient(),
		provideZoneChangeDetection({ eventCoalescing: true }),
		provideRouter(routes),
		provideClientHydration(),
		provideHttpClient(withFetch()),
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
	]
};