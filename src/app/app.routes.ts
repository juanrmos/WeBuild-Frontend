import { Routes } from '@angular/router';
import { authGuard } from '@core/guards/auth.guard';
import { MainLayoutComponent } from '@layout/main-layout/main-layout.component';

export const routes: Routes = [
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  {
    path: 'auth/login',
    loadComponent: () => import('@modules/auth/presentation/containers/login.container')
      .then(m => m.LoginContainer),
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'notas',
        loadComponent: () => import('@modules/notas/presentation/containers/notas-list.container')
          .then(m => m.NotasListContainer),
      },
      {
        path: 'repositorio',
        loadComponent: () => import('@modules/repositorio/presentation/containers/repositorio.container')
          .then(m => m.RepositorioContainer),
      },
      { path: 'colecciones', redirectTo: 'notas' },
      { path: '', redirectTo: 'notas', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: 'auth/login' }
];
