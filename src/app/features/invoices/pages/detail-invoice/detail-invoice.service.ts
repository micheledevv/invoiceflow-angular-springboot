import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Subject } from 'rxjs';

import { Invoice } from '../../models/invoice.model';

@Injectable({
  providedIn: 'root'
})
export class DetailInvoiceService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/invoices';

  readonly singleInvoice = signal<Invoice | null>(null);
  readonly updateSingleInvoice = new Subject<void>();

  getInvoice(invoiceId: string) {
    return this.http.get<Invoice>(`${this.apiUrl}/${invoiceId}`);
  }

  deleteInvoice(invoiceId: string) {
    return this.http.delete<void>(`${this.apiUrl}/${invoiceId}`);
  }

  markAsPaid(invoiceId: string) {
    return this.http.patch<Invoice>(`${this.apiUrl}/${invoiceId}/mark-as-paid`, {});
  }

  takeInvoice(invoice: Invoice): void {
    this.singleInvoice.set(invoice);
  }

  clearInvoice(): void {
    this.singleInvoice.set(null);
  }

  notifySingleInvoiceUpdated(): void {
    this.updateSingleInvoice.next();
  }
}