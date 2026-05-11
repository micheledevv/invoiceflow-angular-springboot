import { TestBed } from '@angular/core/testing';

import { ListInvoicesService } from './list-invoices.service';

describe('ListInvoicesService', () => {
  let service: ListInvoicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListInvoicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
