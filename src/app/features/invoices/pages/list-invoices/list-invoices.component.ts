import { Component, OnInit, signal } from '@angular/core';
import { InvoiceRecordsComponent } from '../../../../shared/components/invoice-records/invoice-records.component';
import { ListInvoicesService } from './list-invoices.service';
import { finalize, tap } from 'rxjs';
import { Invoice } from './../../models/invoice.model'
import { Router } from '@angular/router';
import { InvoiceFormService } from '../../components/invoice-form/invoice-form.service';
import { form, FormField } from '@angular/forms/signals';
import { LoaderService } from '../../../../shared/components/loader/loader.service';

type InvoiceFiltersForm = {
  selectedStatus: string;
};

@Component({
  selector: 'app-list-invoices',
  imports: [InvoiceRecordsComponent, FormField],
  templateUrl: './list-invoices.component.html',
  styleUrl: './list-invoices.component.scss'
})
export class ListInvoicesComponent implements OnInit {
  allInvoices: Invoice[] = [];
  filteredInvoices: Invoice[] = [];

  statusLabel = '';
  totalInvoice = 0;

  protected filtersStatusInvoice = [
    { label: 'Filtra per Stato', value: 'all' },
    { label: 'pending', value: 'pending' },
    { label: 'draft', value: 'draft' },
    { label: 'paid', value: 'paid' },
  ];

  protected modelSelect = signal<InvoiceFiltersForm>({
    selectedStatus: 'all'
  });

  protected modelForm = form(this.modelSelect);

  constructor(
    private listInvoicesService: ListInvoicesService,
    private router: Router,
    private invoiceFormService: InvoiceFormService,
    private loaderService: LoaderService
  ) {}

  ngOnInit(): void {
    this.getAllInvoices();
  }

  protected goToDetail(invoice: Invoice): void {
    this.router.navigate(['/detail-invoice', invoice.id]);
  }

  protected openFormCreate(): void {
    this.invoiceFormService.openForm();
    this.invoiceFormService.setCreateMode();
  }

  protected filteredByStatus(): void {
    const valueSelect = this.modelForm.selectedStatus().value();

    this.statusLabel = this.getStatusLabel(valueSelect);

    if (valueSelect === 'all') {
      this.filteredInvoices = this.allInvoices;
      this.totalInvoice = this.filteredInvoices.length;
      return;
    }

    this.filteredInvoices = this.allInvoices.filter((invoice) => {
      return invoice.status === valueSelect;
    });

    this.totalInvoice = this.filteredInvoices.length;
  }

  protected get invoicesSummary(): string {
    const totalText = this.totalInvoice === 1
      ? "C'è un totale di"
      : 'Ci sono in totale';

    const invoiceText = this.totalInvoice === 1
      ? 'fattura'
      : 'fatture';

    return `${totalText} ${this.totalInvoice} ${invoiceText} ${this.statusLabel}`;
  }

  private getAllInvoices(): void {
    this.loaderService.show();

    this.listInvoicesService.getInvoices().pipe(
      tap((invoices) => {
        this.allInvoices = invoices;
        this.filteredByStatus();
      }),
      finalize(() => {
        this.loaderService.hide();
      })
    ).subscribe();
  }

  private getStatusLabel(status: string): string {
    switch (status) {
      case 'paid':
        return 'in stato: Pagato';

      case 'draft':
        return 'in stato: In bozza';

      case 'pending':
        return 'in stato: In attesa';

      default:
        return '';
    }
  }
}