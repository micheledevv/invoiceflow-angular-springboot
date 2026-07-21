import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoicePdfDownloadButtonComponent } from './invoice-pdf-download-button.component';

describe('InvoicePdfDownloadButtonComponent', () => {
  let component: InvoicePdfDownloadButtonComponent;
  let fixture: ComponentFixture<InvoicePdfDownloadButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvoicePdfDownloadButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvoicePdfDownloadButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
