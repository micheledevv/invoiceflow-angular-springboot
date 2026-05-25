import { Routes } from '@angular/router';
import { ListInvoicesComponent } from './features/invoices/pages/list-invoices/list-invoices.component';
import { DetailInvoiceComponent } from './features/invoices/pages/detail-invoice/detail-invoice.component';
import { PageNotFoundComponent } from './core/pages/page-not-found/page-not-found.component';

export const routes: Routes = [
    {path:'', component: ListInvoicesComponent},
    {path:'detail-invoice/:id', component:DetailInvoiceComponent},
    {path:'**', component:PageNotFoundComponent}
];
