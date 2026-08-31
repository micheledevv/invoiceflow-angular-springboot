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
    path: 'clients',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/clients/clients-list/clients-list.component')
        .then((m) => m.ClientsListComponent)
  },
  {
    path: 'clients/new',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/clients/client-create/client-create.component')
        .then((m) => m.ClientCreateComponent)
  },
  {
    path: 'clients/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/clients/client-detail/client-detail.component')
        .then((m) => m.ClientDetailComponent)
  },
  {
    path: 'clients/:id/edit',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/clients/client-edit/client-edit.component')
        .then((m) => m.ClientEditComponent)
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
    path: 'sent-invoices',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/invoices/pages/sent-invoices/sent-invoices.component')
        .then((m) => m.SentInvoicesComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
