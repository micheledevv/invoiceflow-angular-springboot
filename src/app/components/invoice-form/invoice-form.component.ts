import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { form } from '@angular/forms/signals';

import { GenericInputComponent } from '../../shared/components/generic-input/generic-input.component';
import { SelectInputComponent, SelectOption } from '../../shared/components/select-input/select-input.component';
import { CalendarInputComponent } from '../../shared/components/calendar-input/calendar-input.component';
import { ActionsButtonComponent } from '../../shared/components/actions-button/actions-button.component';
import { InvoiceFormService } from './invoice-form.service';
import { InvoiceFormModel } from '../../models/invoice.form.model';
import { DetailInvoiceService } from '../detail-invoice/detail-invoice.service';
import { Invoice } from '../../models/invoice.model';

@Component({
  selector: 'app-invoice-form',
  imports: [
    GenericInputComponent,
    SelectInputComponent,
    CalendarInputComponent,
    ActionsButtonComponent
  ],
  templateUrl: './invoice-form.component.html',
  styleUrl: './invoice-form.component.scss'
})
export class InvoiceFormComponent implements OnInit {
  private invoiceFormService = inject(InvoiceFormService);
  private detailInvoiceService = inject(DetailInvoiceService)

  ngOnInit(): void {
    if (this.mode() === 'edit') {
      const invoice = this.detailInvoiceService.singleInvoice();

      if (!invoice) {
        return;
      }

      this.patchFormWithInvoice(invoice);
    }
  }

  mode = this.invoiceFormService.mode;
  singleInvoice = this.detailInvoiceService.singleInvoice

  paymentTermsOptions: SelectOption<string>[] = [
    { label: 'Net 1 Giorno', value: '1' },
    { label: 'Net 7 Giorni', value: '7' },
    { label: 'Net 14 Giorni', value: '14' },
    { label: 'Net 30 Giorni', value: '30' }
  ];

  invoiceModel = signal<InvoiceFormModel>({
    senderAddress: {
      street: '',
      city: '',
      postCode: '',
      country: ''
    },
    clientName: '',
    clientEmail: '',
    clientAddress: {
      street: '',
      city: '',
      postCode: '',
      country: ''
    },
    createdAt: '',
    paymentTerms: '30',
    description: ''
  });

  invoiceForm = form(this.invoiceModel);

  protected closeForm(): void {
    console.log('chiuso il form');
    this.invoiceFormService.closeForm();
  }

  protected saveAndSend(): void {
    const formValue = this.invoiceModel();

    const invoiceToSave = {
      ...formValue,
      paymentTerms: Number(formValue.paymentTerms)
    };

    console.log(invoiceToSave);
  }

  protected title = computed(() => {
    return this.mode() === 'create' ? 'Crea fattura' : 'Modifica fattura';
  });

  private patchFormWithInvoice(invoice: Invoice): void {
    this.invoiceModel.set({
      senderAddress: {
        street: invoice.senderAddress.street,
        city: invoice.senderAddress.city,
        postCode: invoice.senderAddress.postCode,
        country: invoice.senderAddress.country
      },
      clientName: invoice.clientName,
      clientEmail: invoice.clientEmail,
      clientAddress: {
        street: invoice.clientAddress.street,
        city: invoice.clientAddress.city,
        postCode: invoice.clientAddress.postCode,
        country: invoice.clientAddress.country
      },
      createdAt: invoice.createdAt,
      paymentTerms: String(invoice.paymentTerms),
      description: invoice.description
    });
  }
}