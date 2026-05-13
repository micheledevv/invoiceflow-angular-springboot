import { Injectable, signal } from '@angular/core';
import { Invoice } from '../../models/invoice.model';

@Injectable({
  providedIn: 'root',
})
export class DetailInvoiceService {
  singleInvoice = signal<Invoice | null>(null);

  takeInvoice(invoice: Invoice): void {
    this.singleInvoice.set(invoice);
  }

  clearInvoice(): void {
    this.singleInvoice.set(null);
  }
}