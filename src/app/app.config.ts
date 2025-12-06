import { APP_INITIALIZER, ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from "@angular/common/http";

import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { authInitializerFactory } from "./app-util/initializers/auth-initializer.factory";
import { AuthService } from "./shared/services/auth.service";
import { themeInitializerFactory } from './app-util/initializers/theme-initializer.factory';
import { ThemeService } from './app-util/services/app-theme.service';

export const appConfig: ApplicationConfig = {
	providers: [
		AuthService,
		provideHttpClient(),
		provideZoneChangeDetection({ eventCoalescing: true }),
		provideRouter(routes),
		provideClientHydration(),
		provideHttpClient(withFetch()),
		provideAnimationsAsync(),
		{
			provide: APP_INITIALIZER,
			useFactory: authInitializerFactory,
			multi: true,
			deps: [AuthService]
		},
		{
			provide: APP_INITIALIZER,
			useFactory: themeInitializerFactory,
			deps: [ThemeService],
			multi: true
		}
	]
};
