import { Routes } from '@angular/router';
import { ListInvoicesComponent } from './components/list-invoices/list-invoices.component';
import { DetailInvoiceComponent } from './components/detail-invoice/detail-invoice.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';

export const routes: Routes = [
    {path:'', component: ListInvoicesComponent},
    {path:'detail-invoice/:id', component:DetailInvoiceComponent},
    {path:'**', component:PageNotFoundComponent}
];
