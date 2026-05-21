import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Invoice } from '../../models/invoice.model';

@Injectable({
  providedIn: 'root'
})
export class ListInvoicesService {

  constructor(
    private http:HttpClient
  ) { }


  getInvoices(): Observable<Invoice[]> {
    const url = 'http://localhost:8080/api/invoices';
    return this.http.get<Invoice[]>(url);
  }
}
