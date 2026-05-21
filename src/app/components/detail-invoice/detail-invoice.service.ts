import { Injectable, signal } from '@angular/core';
import { Invoice } from '../../models/invoice.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DetailInvoiceService {
  constructor(
    private http:HttpClient
  ){}

  getInvoice(invoiceId: string | null) {
    const url = `http://localhost:8080/api/invoices/${invoiceId}`
    return this.http.get<Invoice>(url);
  }

  singleInvoice = signal<Invoice | null>(null);

  takeInvoice(invoice: Invoice): void {
    this.singleInvoice.set(invoice);
  }

  clearInvoice(): void {
    this.singleInvoice.set(null);
  }
}