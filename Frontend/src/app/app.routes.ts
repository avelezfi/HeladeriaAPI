import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/dashboard').then(m => m.Dashboard)
  },
  {
    path: 'productos',
    loadComponent: () =>
      import('./features/productos/productos').then(m => m.Productos)
  },
  {
    path: 'categorias',
    loadComponent: () =>
      import('./features/categorias/categorias').then(m => m.Categorias)
  },
  {
    path: 'mesas',
    loadComponent: () =>
      import('./features/mesas/mesas').then(m => m.Mesas)
  },
  {
    path: 'pedidos',
    loadComponent: () =>
      import('./features/pedidos/pedidos').then(m => m.Pedidos)
  },
  {
    path: 'preparacion',
    loadComponent: () =>
      import('./features/preparacion/preparacion').then(m => m.Preparacion)
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
