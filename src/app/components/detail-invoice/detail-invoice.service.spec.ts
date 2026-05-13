import { TestBed } from '@angular/core/testing';

import { DetailInvoiceService } from './detail-invoice.service';

describe('DetailInvoiceService', () => {
  let service: DetailInvoiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DetailInvoiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
