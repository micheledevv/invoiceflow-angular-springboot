import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Invoice } from '../../models/invoice.model';
import { SentInvoiceFilters, SentInvoiceSort } from './sent-invoices.model';

type ApiSort = {
  sortBy: 'createdAt' | 'paymentDue' | 'total' | 'clientName';
  sortDirection: 'asc' | 'desc';
};

@Injectable({
  providedIn: 'root'
})
export class SentInvoicesService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/invoices/sent';

  getSentInvoices(filters: SentInvoiceFilters): Observable<Invoice[]> {
    const apiSort = this.getApiSort(filters.sort);
    let params = new HttpParams()
      .set('sortBy', apiSort.sortBy)
      .set('sortDirection', apiSort.sortDirection);

    if (filters.search.trim()) {
      params = params.set('search', filters.search.trim());
    }

    if (filters.status !== 'all') {
      params = params.set('status', filters.status);
    }

    if (filters.dateFrom) params = params.set('dateFrom', filters.dateFrom);
    if (filters.dateTo) params = params.set('dateTo', filters.dateTo);
    if (filters.minTotal) params = params.set('minTotal', filters.minTotal);
    if (filters.maxTotal) params = params.set('maxTotal', filters.maxTotal);

    return this.http.get<Invoice[]>(this.apiUrl, { params });
  }

  private getApiSort(sort: SentInvoiceSort): ApiSort {
    const sortMap: Record<SentInvoiceSort, ApiSort> = {
      'createdAt-desc': { sortBy: 'createdAt', sortDirection: 'desc' },
      'createdAt-asc': { sortBy: 'createdAt', sortDirection: 'asc' },
      'paymentDue-asc': { sortBy: 'paymentDue', sortDirection: 'asc' },
      'total-desc': { sortBy: 'total', sortDirection: 'desc' },
      'total-asc': { sortBy: 'total', sortDirection: 'asc' },
      'clientName-asc': { sortBy: 'clientName', sortDirection: 'asc' }
    };

    return sortMap[sort];
  }
}
