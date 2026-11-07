import { ApplicationConfig } from '@angular/core';
import { provideRouter, RouteReuseStrategy } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import {
  IonicRouteStrategy,
  provideIonicAngular
} from '@ionic/angular';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy
    },

    provideIonicAngular(),

    provideRouter(routes),

    provideHttpClient()
  ]
};