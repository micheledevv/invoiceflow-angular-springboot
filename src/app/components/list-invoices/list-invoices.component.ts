import { Component, OnInit, signal } from '@angular/core';
import { InvoiceRecordsComponent } from '../../shared/invoice-records/invoice-records.component';
import { ListInvoicesService } from './list-invoices.service';
import { tap } from 'rxjs';
import { Invoice } from '../../models/invoice.model';
import { Router } from '@angular/router';
import { InvoiceFormService } from '../invoice-form/invoice-form.service';
import { SelectInputComponent } from '../../shared/components/select-input/select-input.component';
import { form, FormField } from '@angular/forms/signals';

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
    private invoiceFormService: InvoiceFormService
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

  filteredByStatus(): void {
    const valueSelect = this.modelForm.selectedStatus().value();

    if (valueSelect === 'all') {
      this.filteredInvoices = this.allInvoices;
      return;
    }

    this.filteredInvoices = this.allInvoices.filter((invoice) => {
      return invoice.status === valueSelect;
    });
  }
}