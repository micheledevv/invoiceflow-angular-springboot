import { Component, OnInit, signal } from '@angular/core';
import { InvoiceRecordsComponent } from '../../shared/invoice-records/invoice-records.component';
import { ListInvoicesService } from './list-invoices.service';
import { tap } from 'rxjs';
import { Invoice } from '../../models/invoice.model';
import { Router } from '@angular/router';
import { InvoiceFormService } from '../invoice-form/invoice-form.service';
import { SelectInputComponent } from '../../shared/components/select-input/select-input.component';
import { form, FormField } from '@angular/forms/signals';
import { LoaderService } from '../../shared/components/loader/loader.service';

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

  filtersStatusInvoice = [
    { label: 'Filtra per Stato', value: 'all' },
    { label: 'pending', value: 'pending' },
    { label: 'draft', value: 'draft' },
    { label: 'paid', value: 'paid' },
  ];

  modelSelect = signal<InvoiceFiltersForm>({
    selectedStatus: 'all'
  });

  modelForm = form(this.modelSelect);

  constructor(
    private listInvoicesService: ListInvoicesService,
    private router: Router,
    private invoiceFormService: InvoiceFormService,
  ) {}

  ngOnInit(): void {
    this.listInvoicesService.getInvoices().pipe(
      tap((invoices) => {
        this.allInvoices = invoices;
        this.filteredByStatus();
      })
    ).subscribe();
  }

  goToDetail(invoice: Invoice): void {
    this.router.navigate(['/detail-invoice', invoice.id]);
  }

  openFormCreate(): void {
    this.invoiceFormService.openForm();
    this.invoiceFormService.setCreateMode();
  }

  statusLabel = 'Tutte le fatture';
  totalInvoice: number = 0;

  filteredByStatus(): void {
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

  get invoicesSummary(): string {
    const totalText = this.totalInvoice === 1
      ? "C'è un totale di"
      : 'Ci sono in totale';

    const invoiceText = this.totalInvoice === 1
      ? 'fattura'
      : 'fatture';

    return `${totalText} ${this.totalInvoice} ${invoiceText} ${this.statusLabel}`;
  }
}