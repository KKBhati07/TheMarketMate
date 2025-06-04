import {APP_INITIALIZER, ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import {provideHttpClient, withFetch} from "@angular/common/http";

import {provideAnimationsAsync} from "@angular/platform-browser/animations/async";
import {appInitializerFactory} from "./app-util/app-initializer.factory";
import {AuthService} from "./services/auth.service";

export const appConfig: ApplicationConfig = {
  providers: [
    AuthService,
    provideHttpClient(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(withFetch()),
    provideAnimationsAsync(),
    {provide:APP_INITIALIZER,useFactory:appInitializerFactory,
      multi:true, deps: [AuthService]}
  ]
};
