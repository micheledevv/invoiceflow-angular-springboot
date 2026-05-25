import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { form } from '@angular/forms/signals';

import { GenericInputComponent } from '../../../../shared/components/generic-input/generic-input.component';
import { SelectInputComponent, SelectOption } from '../../../../shared/components/select-input/select-input.component';
import { CalendarInputComponent } from '../../../../shared/components/calendar-input/calendar-input.component';
import { ActionsButtonComponent } from '../../../../shared/components/actions-button/actions-button.component';

import { InvoiceFormService } from './invoice-form.service';
import { InvoiceFormModel } from '../../models/invoice.form.model';
import { DetailInvoiceService } from '../../pages/detail-invoice/detail-invoice.service';
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
  private detailInvoiceService = inject(DetailInvoiceService);

  mode = this.invoiceFormService.mode;
  singleInvoice = this.detailInvoiceService.singleInvoice;

  paymentTermsOptions: SelectOption<string>[] = [
    { label: 'Net 1 Giorno', value: '1' },
    { label: 'Net 7 Giorni', value: '7' },
    { label: 'Net 14 Giorni', value: '14' },
    { label: 'Net 30 Giorni', value: '30' }
  ];

  invoiceModel = signal<InvoiceFormModel>(this.getEmptyForm());

  invoiceForm = form(this.invoiceModel);

  title = computed(() => {
    const invoice = this.singleInvoice();

    if (this.mode() === 'create') {
      return 'Crea fattura';
    }

    return invoice ? `Modifica #${invoice.id}` : 'Modifica fattura';
  });

  ngOnInit(): void {
    if (this.mode() === 'edit') {
      const invoice = this.detailInvoiceService.singleInvoice();

      if (!invoice) {
        return;
      }

      this.patchFormWithInvoice(invoice);
      return;
    }

    this.resetForm();
  }

  protected addItem(): void {
    this.invoiceModel.update((currentForm) => ({
      ...currentForm,
      items: [
        ...currentForm.items,
        {
          name: '',
          quantity: '',
          price: ''
        }
      ]
    }));
  }

  protected removeItem(index: number): void {
    this.invoiceModel.update((currentForm) => ({
      ...currentForm,
      items: currentForm.items.filter((_, itemIndex) => itemIndex !== index)
    }));
  }

  protected getItemTotal(index: number): number {
    const item = this.invoiceModel().items[index];

    if (!item) {
      return 0;
    }

    return Number(item.quantity || 0) * Number(item.price || 0);
  }

  protected getInvoiceTotal(): number {
    return this.invoiceModel().items.reduce((total, item) => {
      return total + Number(item.quantity || 0) * Number(item.price || 0);
    }, 0);
  }

  protected closeForm(): void {
    this.invoiceFormService.closeForm();
  }

  protected saveAndSend(): void {
    const formValue = this.invoiceModel();

    const invoiceToSave = {
      ...formValue,
      paymentTerms: Number(formValue.paymentTerms),
      items: formValue.items.map((item) => ({
        name: item.name,
        quantity: Number(item.quantity || 0),
        price: Number(item.price || 0),
        total: Number(item.quantity || 0) * Number(item.price || 0)
      })),
      total: this.getInvoiceTotal()
    };

    console.log('Salva e invia:', invoiceToSave);
  }

  protected saveChanges(): void {
    const formValue = this.invoiceModel();

    const invoiceToUpdate = {
      ...formValue,
      paymentTerms: Number(formValue.paymentTerms),
      items: formValue.items.map((item) => ({
        name: item.name,
        quantity: Number(item.quantity || 0),
        price: Number(item.price || 0),
        total: Number(item.quantity || 0) * Number(item.price || 0)
      })),
      total: this.getInvoiceTotal()
    };

    console.log('Salva modifiche:', invoiceToUpdate);
  }

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
      description: invoice.description,
      items: invoice.items.map((item) => ({
        name: item.name,
        quantity: String(item.quantity),
        price: String(item.price)
      }))
    });
  }

  private resetForm(): void {
    this.invoiceModel.set(this.getEmptyForm());
  }

  private getEmptyForm(): InvoiceFormModel {
    return {
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
      description: '',
      items: [
        {
          name: '',
          quantity: '',
          price: ''
        }
      ]
    };
  }
}