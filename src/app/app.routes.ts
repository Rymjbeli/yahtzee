import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'game',
    loadChildren: () => import('./layout/layout-main-game/layout-main-game.routing').then(m => m.MainGameRoutes)
  }
];
