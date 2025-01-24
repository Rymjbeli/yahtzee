import { Routes } from '@angular/router';
import {gameFactory} from "./shared/factories/game-factory";
import {BaseGameService} from "./shared/services/game/base-game.service";

export const routes: Routes = [
  {
    path: 'game',
    providers:[
      {
        provide: BaseGameService,
        useFactory: gameFactory,
      },
    ],
    loadChildren: () => import('./layout/layout-main-game/layout-main-game.routing').then(m => m.MainGameRoutes)
  },
  {
    path: '',
    loadComponent: () => import('./pages/home-page/home-page.component').then(m => m.HomePageComponent)
  }
];
