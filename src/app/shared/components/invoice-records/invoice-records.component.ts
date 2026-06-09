import { Component, input, output } from '@angular/core';
import { Invoice } from '../../../features/invoices/models/invoice.model';
import { EuroCurrencyPipe } from "../../pipes/euro-currency.pipe";
import { ItalianDatePipe } from "../../pipes/italian-date.pipe";

type InvoiceStatus = 'paid' | 'pending' | 'draft';

@Component({
  selector: 'app-invoice-records',
  imports: [EuroCurrencyPipe, ItalianDatePipe],
  templateUrl: './invoice-records.component.html',
  styleUrl: './invoice-records.component.scss'
})
export class InvoiceRecordsComponent {
  invoices = input.required<Invoice[]>();

  invoiceDetail = output<Invoice>();

  statusLabels: Record<InvoiceStatus, string> = {
    paid: 'Pagata',
    pending: 'In attesa',
    draft: 'Bozza'
  };

  getStatusLabel(status: string): string {
    return this.statusLabels[status as InvoiceStatus] ?? status;
  }
}