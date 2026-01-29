import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { bootstrapLogger } from 'mm-shared';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => bootstrapLogger.error('Angular bootstrap failed', err));
