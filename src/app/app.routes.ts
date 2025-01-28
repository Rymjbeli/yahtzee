import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'game',
    loadChildren: () => import('./layout/layout-main-game/layout-main-game.routing').then(m => m.MainGameRoutes)
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home-page/home-page.component').then(m => m.HomePageComponent)
  }
];
