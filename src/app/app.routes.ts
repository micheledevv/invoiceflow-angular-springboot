import { Routes } from '@angular/router';
import { ListInvoicesComponent } from './components/list-invoices/list-invoices.component';
import { DetailInvoiceComponent } from './components/detail-invoice/detail-invoice.component';

export const routes: Routes = [
    {path:'', component: ListInvoicesComponent},
    {path:'detail-invoice/:id', component:DetailInvoiceComponent}
];
