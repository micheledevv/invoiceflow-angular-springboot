import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { Invoice } from '../../models/invoice.model';

@Injectable({
  providedIn: 'root'
})
export class InvoiceFormService {
  private readonly http = inject(HttpClient);
  
  private readonly apiUrl = 'http://localhost:8080/api/invoices';

  readonly isFormOpen = signal<boolean>(false);
  readonly mode = signal<'create' | 'edit'>('create');

  readonly updateGetInvoices = new Subject<void>();
  notifyInvoicesUpdated(): void {
    this.updateGetInvoices.next();
  }

  setCreateMode(): void {
    this.mode.set('create');
  }

  setEditMode(): void {
    this.mode.set('edit');
  }

  openForm(): void {
    this.isFormOpen.set(true);
  }

  closeForm(): void {
    this.isFormOpen.set(false);
  }

  toggleForm(): void {
    this.isFormOpen.update((isOpen) => !isOpen);
  }

  createInvoice(invoice: Invoice):Observable<Invoice> {
    return this.http.post<Invoice>(this.apiUrl, invoice);
  }

  updateInvoice(id: string, invoice: Invoice):Observable<Invoice> {
    return this.http.put<Invoice>(`${this.apiUrl}/${id}`, invoice);
  }


}