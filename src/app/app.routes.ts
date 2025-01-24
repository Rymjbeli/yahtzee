import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'game',
    loadChildren: () => import('./layout/layout-main-game/layout-main-game.routing').then(m => m.MainGameRoutes)
  },
  {
    path: '',
    loadComponent: () => import('./pages/home-page/home-page.component').then(m => m.HomePageComponent)
  }
];
