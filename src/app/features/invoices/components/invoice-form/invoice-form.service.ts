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
  readonly initialClientId = signal<string | null>(null);

  readonly updateGetInvoices = new Subject<void>();
  notifyInvoicesUpdated(): void {
    this.updateGetInvoices.next();
  }

  setCreateMode(clientId: string | null = null): void {
    this.mode.set('create');
    this.initialClientId.set(clientId);
  }

  setEditMode(): void {
    this.mode.set('edit');
    this.initialClientId.set(null);
  }

  openForm(): void {
    this.isFormOpen.set(true);
  }

  closeForm(): void {
    this.isFormOpen.set(false);
    this.initialClientId.set(null);
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
