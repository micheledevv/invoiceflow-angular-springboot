import { convertToParamMap } from '@angular/router';

import {
  countActiveSentInvoiceFilters,
  DEFAULT_SENT_INVOICE_FILTERS,
  getSentInvoiceFilterError,
  parseSentInvoiceFilters,
  serializeSentInvoiceFilters
} from './sent-invoices.model';

describe('Sent invoice filters', () => {
  it('parses supported URL filters and ignores unsupported values', () => {
    const filters = parseSentInvoiceFilters(convertToParamMap({
      q: '  #INV-42  ',
      status: 'pending',
      from: '2026-01-01',
      to: 'not-a-date',
      min: '100.50',
      max: '-2',
      sort: 'total-desc'
    }));

    expect(filters).toEqual({
      search: '#INV-42',
      status: 'pending',
      dateFrom: '2026-01-01',
      dateTo: '',
      minTotal: '100.5',
      maxTotal: '',
      sort: 'total-desc'
    });
  });

  it('serializes only active filters', () => {
    const params = serializeSentInvoiceFilters({
      ...DEFAULT_SENT_INVOICE_FILTERS,
      search: 'Acme',
      status: 'paid',
      sort: 'clientName-asc'
    });

    expect(params).toEqual({
      q: 'Acme',
      status: 'paid',
      sort: 'clientName-asc'
    });
  });

  it('validates ranges and counts active filters', () => {
    const filters = {
      ...DEFAULT_SENT_INVOICE_FILTERS,
      dateFrom: '2026-08-31',
      dateTo: '2026-01-01',
      minTotal: '500',
      maxTotal: '100'
    };

    expect(getSentInvoiceFilterError(filters)).toContain('data iniziale');
    expect(countActiveSentInvoiceFilters(filters)).toBe(4);

    expect(getSentInvoiceFilterError({
      ...filters,
      dateFrom: '',
      dateTo: ''
    })).toContain('importo minimo');
  });
});
