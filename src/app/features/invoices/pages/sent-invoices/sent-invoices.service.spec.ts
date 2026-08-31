import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { DEFAULT_SENT_INVOICE_FILTERS } from './sent-invoices.model';
import { SentInvoicesService } from './sent-invoices.service';

describe('SentInvoicesService', () => {
  let service: SentInvoicesService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });

    service = TestBed.inject(SentInvoicesService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('sends only the active filters to the sent invoices endpoint', () => {
    service.getSentInvoices({
      ...DEFAULT_SENT_INVOICE_FILTERS,
      search: '  Rossi ',
      status: 'paid',
      dateFrom: '2026-01-01',
      minTotal: '50',
      sort: 'total-desc'
    }).subscribe((invoices) => {
      expect(invoices).toEqual([]);
    });

    const request = httpTesting.expectOne((candidate) =>
      candidate.url === 'http://localhost:8080/api/invoices/sent'
    );

    expect(request.request.method).toBe('GET');
    expect(request.request.params.get('search')).toBe('Rossi');
    expect(request.request.params.get('status')).toBe('paid');
    expect(request.request.params.get('dateFrom')).toBe('2026-01-01');
    expect(request.request.params.get('minTotal')).toBe('50');
    expect(request.request.params.get('sortBy')).toBe('total');
    expect(request.request.params.get('sortDirection')).toBe('desc');
    expect(request.request.params.has('dateTo')).toBeFalse();

    request.flush([]);
  });
});
