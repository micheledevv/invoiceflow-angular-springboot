import {
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  signal
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  EMPTY,
  finalize,
  Subject,
  switchMap,
  tap
} from 'rxjs';

import { InvoiceRecordsComponent } from '../../../../shared/components/invoice-records/invoice-records.component';
import { EuroCurrencyPipe } from '../../../../shared/pipes/euro-currency.pipe';
import { InvoiceFormService } from '../../components/invoice-form/invoice-form.service';
import { Invoice } from '../../models/invoice.model';
import {
  countActiveSentInvoiceFilters,
  DEFAULT_SENT_INVOICE_FILTERS,
  getSentInvoiceFilterError,
  parseSentInvoiceFilters,
  SentInvoiceFilters,
  SentInvoiceSort,
  SentInvoiceStatusFilter,
  serializeSentInvoiceFilters
} from './sent-invoices.model';
import { SentInvoicesService } from './sent-invoices.service';

type FilterField = 'dateFrom' | 'dateTo' | 'minTotal' | 'maxTotal';

@Component({
  selector: 'app-sent-invoices',
  imports: [InvoiceRecordsComponent, EuroCurrencyPipe],
  templateUrl: './sent-invoices.component.html',
  styleUrl: './sent-invoices.component.scss'
})
export class SentInvoicesComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly sentInvoicesService = inject(SentInvoicesService);
  private readonly invoiceFormService = inject(InvoiceFormService);

  private readonly loadRequests = new Subject<SentInvoiceFilters>();
  private readonly searchChanges = new Subject<string>();

  protected readonly invoices = signal<Invoice[]>([]);
  protected readonly filters = signal<SentInvoiceFilters>({
    ...DEFAULT_SENT_INVOICE_FILTERS
  });
  protected readonly searchTerm = signal('');
  protected readonly isLoading = signal(true);
  protected readonly hasLoadError = signal(false);
  protected readonly filtersAreOpen = signal(true);

  protected readonly activeFilterCount = computed(() =>
    countActiveSentInvoiceFilters(this.filters())
  );
  protected readonly filterError = computed(() =>
    getSentInvoiceFilterError(this.filters())
  );
  protected readonly pendingCount = computed(() =>
    this.invoices().filter((invoice) => invoice.status === 'pending').length
  );
  protected readonly paidCount = computed(() =>
    this.invoices().filter((invoice) => invoice.status === 'paid').length
  );
  protected readonly filteredTotal = computed(() =>
    this.invoices().reduce((total, invoice) => total + invoice.total, 0)
  );
  protected readonly resultSummary = computed(() => {
    const count = this.invoices().length;

    return count === 1
      ? '1 fattura corrisponde ai criteri selezionati'
      : `${count} fatture corrispondono ai criteri selezionati`;
  });

  ngOnInit(): void {
    this.configureLoading();
    this.configureUrlFilters();
    this.configureSearch();
    this.configureInvoiceUpdates();
  }

  protected onSearchChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value.slice(0, 100);

    this.searchTerm.set(value);
    this.searchChanges.next(value);
  }

  protected clearSearch(): void {
    this.searchTerm.set('');
    this.searchChanges.next('');
    this.navigateWithFilters({ ...this.filters(), search: '' });
  }

  protected onStatusChange(event: Event): void {
    const status = (event.target as HTMLSelectElement)
      .value as SentInvoiceStatusFilter;

    this.patchFilters({ status });
  }

  protected onSortChange(event: Event): void {
    const sort = (event.target as HTMLSelectElement).value as SentInvoiceSort;

    this.patchFilters({ sort });
  }

  protected onFilterChange(field: FilterField, event: Event): void {
    const value = (event.target as HTMLInputElement).value;

    this.patchFilters({ [field]: value });
  }

  protected toggleFilters(): void {
    this.filtersAreOpen.update((isOpen) => !isOpen);
  }

  protected resetFilters(): void {
    this.searchTerm.set('');
    this.searchChanges.next('');
    this.navigateWithFilters({ ...DEFAULT_SENT_INVOICE_FILTERS });
  }

  protected retry(): void {
    this.loadRequests.next(this.filters());
  }

  protected openCreateForm(): void {
    this.invoiceFormService.setCreateMode();
    this.invoiceFormService.openForm();
  }

  protected openInvoice(invoice: Invoice): void {
    this.router.navigate(['/detail-invoice', invoice.id], {
      queryParams: { returnTo: this.router.url }
    });
  }

  protected goBack(): void {
    this.router.navigateByUrl('/');
  }

  private configureLoading(): void {
    this.loadRequests
      .pipe(
        tap(() => {
          this.isLoading.set(true);
          this.hasLoadError.set(false);
        }),
        switchMap((filters) => {
          if (getSentInvoiceFilterError(filters)) {
            this.invoices.set([]);
            this.isLoading.set(false);
            return EMPTY;
          }

          return this.sentInvoicesService.getSentInvoices(filters)
            .pipe(
              tap((invoices) => {
                this.invoices.set(invoices);
              }),
              catchError(() => {
                this.invoices.set([]);
                this.hasLoadError.set(true);
                return EMPTY;
              }),
              finalize(() => {
                this.isLoading.set(false);
              })
            );
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  private configureUrlFilters(): void {
    this.route.queryParamMap
      .pipe(
        tap((params) => {
          const filters = parseSentInvoiceFilters(params);

          this.filters.set(filters);
          this.searchTerm.set(filters.search);
          this.loadRequests.next(filters);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  private configureSearch(): void {
    this.searchChanges
      .pipe(
        debounceTime(350),
        distinctUntilChanged(),
        tap((search) => {
          this.navigateWithFilters({ ...this.filters(), search });
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  private configureInvoiceUpdates(): void {
    this.invoiceFormService.updateGetInvoices
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.loadRequests.next(this.filters());
      });
  }

  private patchFilters(patch: Partial<SentInvoiceFilters>): void {
    this.navigateWithFilters({
      ...this.filters(),
      search: this.searchTerm(),
      ...patch
    });
  }

  private navigateWithFilters(filters: SentInvoiceFilters): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: serializeSentInvoiceFilters(filters),
      replaceUrl: true
    });
  }
}
