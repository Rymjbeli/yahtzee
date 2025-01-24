import {ApplicationConfig, importProvidersFrom} from '@angular/core';
import {provideRouter} from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {HttpClient, provideHttpClient, withFetch} from "@angular/common/http";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {BaseGameService} from "./shared/services/game/base-game.service";
import {httpLoaderFactory} from "./shared/factories/http-loader-factory";
import {gameFactory} from "./shared/factories/game-factory";
import { provideMarkdown } from 'ngx-markdown';

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
    {
      provide: BaseGameService,
      useFactory: gameFactory,
    },
  ],
};
