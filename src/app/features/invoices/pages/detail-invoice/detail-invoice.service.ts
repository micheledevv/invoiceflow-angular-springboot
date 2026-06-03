import { Injectable, signal } from '@angular/core';
import { Invoice } from '../../models/invoice.model';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

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

  deleteInvoice(id: string) {
   const apiUrl = 'http://localhost:8080/api/invoices';
   return this.http.delete<void>(`${apiUrl}/${id}`);
  }

  markAsPaid(id: string) {
   const url = 'http://localhost:8080/api/invoices';
   return this.http.patch<Invoice>(`${url}/${id}/mark-as-paid`, {});
  }

  updateSingleInvoice = new Subject<string>
}