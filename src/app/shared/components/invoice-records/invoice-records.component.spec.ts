import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceRecordsComponent } from './invoice-records.component';

describe('InvoiceRecordsComponent', () => {
  let component: InvoiceRecordsComponent;
  let fixture: ComponentFixture<InvoiceRecordsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvoiceRecordsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvoiceRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
