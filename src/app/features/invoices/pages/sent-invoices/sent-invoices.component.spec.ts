import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { BehaviorSubject, of, Subject } from 'rxjs';
import { convertToParamMap } from '@angular/router';

import { InvoiceFormService } from '../../components/invoice-form/invoice-form.service';
import { SentInvoicesComponent } from './sent-invoices.component';
import { SentInvoicesService } from './sent-invoices.service';
import { ActivatedRoute } from '@angular/router';

describe('SentInvoicesComponent', () => {
  let fixture: ComponentFixture<SentInvoicesComponent>;
  let sentInvoicesService: jasmine.SpyObj<SentInvoicesService>;
  const queryParamMap = new BehaviorSubject(convertToParamMap({}));
  const invoiceUpdates = new Subject<void>();

  beforeEach(async () => {
    sentInvoicesService = jasmine.createSpyObj<SentInvoicesService>(
      'SentInvoicesService',
      ['getSentInvoices']
    );
    sentInvoicesService.getSentInvoices.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [SentInvoicesComponent],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: { queryParamMap: queryParamMap.asObservable() }
        },
        { provide: SentInvoicesService, useValue: sentInvoicesService },
        {
          provide: InvoiceFormService,
          useValue: {
            updateGetInvoices: invoiceUpdates,
            setCreateMode: jasmine.createSpy('setCreateMode'),
            openForm: jasmine.createSpy('openForm')
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SentInvoicesComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('loads sent invoices using the filters parsed from the URL', () => {
    expect(sentInvoicesService.getSentInvoices).toHaveBeenCalledWith(
      jasmine.objectContaining({ status: 'all', sort: 'createdAt-desc' })
    );
  });

  it('renders the professional empty state after a successful load', () => {
    const text = fixture.nativeElement.textContent as string;

    expect(text).toContain('Fatture inviate');
    expect(text).toContain('Non hai ancora inviato fatture');
  });
});
