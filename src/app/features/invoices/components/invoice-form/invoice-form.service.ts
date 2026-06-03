import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Invoice } from '../../models/invoice.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InvoiceFormService {
  private http = inject(HttpClient)
  private readonly apiUrl = 'http://localhost:8080/api/invoices';
  
  isFormOpen = signal<boolean>(false);
  mode = signal<'create' | 'edit'>('create')

  setCreateMode():void{
    this.mode.set('create');
  }
  setEditMode():void{
    this.mode.set('edit');
  }

  openForm(): void {
    this.isFormOpen.set(true);
  }

  closeForm(): void {
    this.isFormOpen.set(false);
  }

  toggleForm(): void {
    this.isFormOpen.update(value => !value);
  }

  createInvoice(invoice: Invoice) {
   return this.http.post<Invoice>(this.apiUrl, invoice);
  }

  updateInvoice(id: string, invoice: Invoice) {
    return this.http.put<Invoice>(`${this.apiUrl}/${id}`, invoice);
  }

  updateGetInvoices = new Subject<string>;
}