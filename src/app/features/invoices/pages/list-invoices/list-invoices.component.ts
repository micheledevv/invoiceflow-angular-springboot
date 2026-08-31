import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { finalize, tap } from 'rxjs';
import { form, FormField } from '@angular/forms/signals';

import { InvoiceRecordsComponent } from '../../../../shared/components/invoice-records/invoice-records.component';
import { LoaderService } from '../../../../shared/components/loader/loader.service';

import { InvoiceFormService } from '../../components/invoice-form/invoice-form.service';
import { ListInvoicesService } from './list-invoices.service';

import { Invoice, InvoiceStatus } from '../../models/invoice.model';
import { MessagesLoader } from '../../../../shared/components/loader/models/text.messages.model';

type InvoiceStatusFilter = InvoiceStatus | 'all';

type InvoiceFiltersForm = {
  selectedStatus: InvoiceStatusFilter;
};

type InvoiceStatusOption = {
  label: string;
  value: InvoiceStatusFilter;
};

@Component({
  selector: 'app-list-invoices',
  imports: [InvoiceRecordsComponent, FormField],
  templateUrl: './list-invoices.component.html',
  styleUrl: './list-invoices.component.scss'
})
export class ListInvoicesComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  private readonly listInvoicesService = inject(ListInvoicesService);
  private readonly invoiceFormService = inject(InvoiceFormService);
  private readonly loaderService = inject(LoaderService);

  private readonly invoices = signal<Invoice[]>([]);

  protected readonly statusFilters: InvoiceStatusOption[] = [
    { label: 'Filtra per stato', value: 'all' },
    { label: 'In attesa', value: 'pending' },
    { label: 'In bozza', value: 'draft' },
    { label: 'Pagata', value: 'paid' }
  ];

  protected readonly filtersModel = signal<InvoiceFiltersForm>({
    selectedStatus: 'all'
  });

  protected readonly filtersForm = form(this.filtersModel);

  protected readonly filteredInvoices = computed(() => {
    const selectedStatus = this.filtersModel().selectedStatus;
    const invoices = this.invoices();

    if (selectedStatus === 'all') {
      return invoices;
    }

    return invoices.filter((invoice) => invoice.status === selectedStatus);
  });

  protected readonly hasInvoices = computed(() => {
   return this.invoices().length > 0;
  });

  protected readonly emptyStateTitle = computed(() => {
    if (!this.hasInvoices()) {
      return 'Non ci sono ancora fatture';
    }

    return 'Nessuna fattura trovata';
  });

  protected readonly emptyStateDescription = computed(() => {
    if (!this.hasInvoices()) {
      return 'Crea una nuova fattura cliccando sul pulsante sopra a destra.';
    }

    return 'Non ci sono fatture disponibili per lo stato selezionato.';
  });

  protected readonly invoicesSummary = computed(() => {
    const totalInvoices = this.filteredInvoices().length;
    const selectedStatus = this.filtersModel().selectedStatus;

    const totalText = totalInvoices === 1
      ? "C'è un totale di"
      : 'Ci sono in totale';

    const invoiceText = totalInvoices === 1
      ? 'fattura'
      : 'fatture';

    return `${totalText} ${totalInvoices} ${invoiceText} ${this.getStatusLabel(selectedStatus)}`;
  });

  ngOnInit(): void {
    this.getInvoices();

    this.invoiceFormService.updateGetInvoices
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.getInvoices();
      });
  }

  protected goToDetail(invoice: Invoice): void {
    this.router.navigate(['/detail-invoice', invoice.id]);
  }

  protected openCreateForm(): void {
    this.invoiceFormService.setCreateMode();
    this.invoiceFormService.openForm();
  }

  private getInvoices(): void {
    this.loaderService.show(MessagesLoader.loadingInvoices);

    this.listInvoicesService.getInvoices()
      .pipe(
        tap((invoices) => {
          this.invoices.set(invoices);
        }),
        finalize(() => {
          this.loaderService.hide();
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  private getStatusLabel(status: InvoiceStatusFilter): string {
    const statusLabels: Record<InvoiceStatusFilter, string> = {
      all: '',
      paid: 'in stato: Pagata',
      draft: 'in stato: In bozza',
      pending: 'in stato: In attesa'
    };

    return statusLabels[status];
  }
}
