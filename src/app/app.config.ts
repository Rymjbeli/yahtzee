import { ApplicationConfig, importProvidersFrom, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HttpClient, provideHttpClient, withFetch } from "@angular/common/http";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import { httpLoaderFactory } from "./shared/factories/http-loader-factory";
import { provideMarkdown } from 'ngx-markdown';
import { provideServiceWorker } from '@angular/service-worker';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(), provideMarkdown(),
    provideAnimationsAsync(),
    provideHttpClient(withFetch()),
    importProvidersFrom([TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient],
      },
    })]),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
};
