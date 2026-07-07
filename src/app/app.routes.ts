import { Routes } from '@angular/router';

import { authGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./core/pages/login/login.component')
        .then((m) => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./core/pages/register/register.component')
        .then((m) => m.RegisterComponent)
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/invoices/pages/list-invoices/list-invoices.component')
        .then((m) => m.ListInvoicesComponent)
  },
  {
    path: 'detail-invoice/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/invoices/pages/detail-invoice/detail-invoice.component')
        .then((m) => m.DetailInvoiceComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];