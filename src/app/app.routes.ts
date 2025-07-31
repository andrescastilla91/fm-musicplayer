import { Routes } from '@angular/router';
import { authGuard } from '@core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    title: 'FM MusicPlayer',
    loadComponent: () => import('./features/home-page/home-page').then(m => m.HomePageComponent),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadChildren: () => import('./features/dashboard/dashboard.routes').then(m => m.routes),
  },
  {
    path: '**',
    redirectTo: '',
  }
];
