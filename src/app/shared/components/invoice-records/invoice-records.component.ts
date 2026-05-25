import { Component, EventEmitter, output, input } from '@angular/core';
import { Invoice } from '../../../features/invoices/models/invoice.model';

@Component({
  selector: 'app-invoice-records',
  imports: [],
  templateUrl: './invoice-records.component.html',
  styleUrl: './invoice-records.component.scss'
})
export class InvoiceRecordsComponent {
  constructor(){}
  invoices = input.required<Invoice[]>();
  invoiceDetail = output<Invoice>();
}