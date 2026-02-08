import {
  APP_INITIALIZER,
  ApplicationConfig,
  ErrorHandler,
  provideZoneChangeDetection
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './utils/app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  authInitializerFactory,
  AuthService,
  GlobalErrorHandler,
  provideSharedLib,
  themeInitializerFactory,
  ThemeService
} from '@marketmate/shared';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withFetch()),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),

    // 3. LIBRARY CONFIG: must run first to configure ApiService, AuthService, etc.
    ...provideSharedLib({
      apiUrl: environment.apiUrl
    }),
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