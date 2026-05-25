import { TestBed } from '@angular/core/testing';

import { InvoiceRecordsService } from './invoice-records.service';

describe('InvoiceRecordsService', () => {
  let service: InvoiceRecordsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InvoiceRecordsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
