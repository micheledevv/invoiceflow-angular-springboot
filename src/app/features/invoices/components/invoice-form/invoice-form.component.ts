import { Component, computed, inject, OnInit, signal } from '@angular/core';
import {
  applyEach,
  email,
  form,
  maxLength,
  minLength,
  pattern,
  required
} from '@angular/forms/signals';

import { GenericInputComponent } from '../../../../shared/components/generic-input/generic-input.component';
import { SelectInputComponent, SelectOption } from '../../../../shared/components/select-input/select-input.component';
import { CalendarInputComponent } from '../../../../shared/components/calendar-input/calendar-input.component';
import { ActionsButtonComponent } from '../../../../shared/components/actions-button/actions-button.component';

import { InvoiceFormService } from './invoice-form.service';
import { InvoiceFormModel } from '../../models/invoice.form.model';
import { DetailInvoiceService } from '../../pages/detail-invoice/detail-invoice.service';
import { Invoice } from '../../models/invoice.model';
import { finalize, tap } from 'rxjs';
import { LoaderService } from '../../../../shared/components/loader/loader.service';
import { Router } from '@angular/router';

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
  private loaderService = inject(LoaderService)
  private router = inject(Router)

  mode = this.invoiceFormService.mode;
  singleInvoice = this.detailInvoiceService.singleInvoice;

  paymentTermsOptions: SelectOption<string>[] = [
    { label: 'Net 1 Giorno', value: '1' },
    { label: 'Net 7 Giorni', value: '7' },
    { label: 'Net 14 Giorni', value: '14' },
    { label: 'Net 30 Giorni', value: '30' }
  ];

  invoiceModel = signal<InvoiceFormModel>(this.getEmptyForm());

  invoiceForm = form(this.invoiceModel, (schemaPath) => {
  // Da chi viene emessa
  required(schemaPath.senderAddress.street, {
    message: 'L’indirizzo del mittente è obbligatorio'
  });

  minLength(schemaPath.senderAddress.street, 5, {
    message: 'L’indirizzo deve contenere almeno 5 caratteri'
  });

  maxLength(schemaPath.senderAddress.street, 80, {
    message: 'L’indirizzo non può superare 80 caratteri'
  });

  required(schemaPath.senderAddress.city, {
    message: 'La città del mittente è obbligatoria'
  });

  minLength(schemaPath.senderAddress.city, 2, {
    message: 'La città deve contenere almeno 2 caratteri'
  });

  maxLength(schemaPath.senderAddress.city, 40, {
    message: 'La città non può superare 40 caratteri'
  });

  required(schemaPath.senderAddress.postCode, {
    message: 'Il CAP del mittente è obbligatorio'
  });

  pattern(schemaPath.senderAddress.postCode, /^[0-9]{5}$/, {
    message: 'Il CAP deve contenere 5 numeri'
  });

  required(schemaPath.senderAddress.country, {
    message: 'Il paese del mittente è obbligatorio'
  });

  minLength(schemaPath.senderAddress.country, 2, {
    message: 'Il paese deve contenere almeno 2 caratteri'
  });

  maxLength(schemaPath.senderAddress.country, 40, {
    message: 'Il paese non può superare 40 caratteri'
  });

  // Cliente
  required(schemaPath.clientName, {
    message: 'Il nome cliente è obbligatorio'
  });

  minLength(schemaPath.clientName, 2, {
    message: 'Il nome cliente deve contenere almeno 2 caratteri'
  });

  maxLength(schemaPath.clientName, 60, {
    message: 'Il nome cliente non può superare 60 caratteri'
  });

  required(schemaPath.clientEmail, {
    message: 'L’email cliente è obbligatoria'
  });

  email(schemaPath.clientEmail, {
    message: 'Inserisci un’email valida'
  });

  required(schemaPath.clientAddress.street, {
    message: 'L’indirizzo del cliente è obbligatorio'
  });

  minLength(schemaPath.clientAddress.street, 5, {
    message: 'L’indirizzo cliente deve contenere almeno 5 caratteri'
  });

  maxLength(schemaPath.clientAddress.street, 80, {
    message: 'L’indirizzo cliente non può superare 80 caratteri'
  });

  required(schemaPath.clientAddress.city, {
    message: 'La città del cliente è obbligatoria'
  });

  minLength(schemaPath.clientAddress.city, 2, {
    message: 'La città deve contenere almeno 2 caratteri'
  });

  maxLength(schemaPath.clientAddress.city, 40, {
    message: 'La città non può superare 40 caratteri'
  });

  required(schemaPath.clientAddress.postCode, {
    message: 'Il CAP del cliente è obbligatorio'
  });

  pattern(schemaPath.clientAddress.postCode, /^[0-9]{5}$/, {
    message: 'Il CAP deve contenere 5 numeri'
  });

  required(schemaPath.clientAddress.country, {
    message: 'Il paese del cliente è obbligatorio'
  });

  minLength(schemaPath.clientAddress.country, 2, {
    message: 'Il paese deve contenere almeno 2 caratteri'
  });

  maxLength(schemaPath.clientAddress.country, 40, {
    message: 'Il paese non può superare 40 caratteri'
  });

  // Dati fattura
  required(schemaPath.createdAt, {
    message: 'La data fattura è obbligatoria'
  });

  required(schemaPath.paymentTerms, {
    message: 'I termini di pagamento sono obbligatori'
  });

  required(schemaPath.description, {
    message: 'La descrizione progetto è obbligatoria'
  });

  minLength(schemaPath.description, 3, {
    message: 'La descrizione deve contenere almeno 3 caratteri'
  });

  maxLength(schemaPath.description, 100, {
    message: 'La descrizione non può superare 100 caratteri'
  });

  // Lista articoli
  applyEach(schemaPath.items, (itemPath) => {
    required(itemPath.name, {
      message: 'Il nome articolo è obbligatorio'
    });

    minLength(itemPath.name, 2, {
      message: 'Il nome articolo deve contenere almeno 2 caratteri'
    });

    maxLength(itemPath.name, 60, {
      message: 'Il nome articolo non può superare 60 caratteri'
    });

    required(itemPath.quantity, {
      message: 'La quantità è obbligatoria'
    });

    pattern(itemPath.quantity, /^[1-9][0-9]*$/, {
      message: 'La quantità deve essere maggiore di 0'
    });

    required(itemPath.price, {
      message: 'Il prezzo è obbligatorio'
    });

    pattern(itemPath.price, /^(?!0+(?:\.0+)?$)\d+(?:[.,]\d{1,2})?$/, {
      message: 'Il prezzo deve essere maggiore di 0'
    });
  });
});

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
  this.loaderService.show()
  const formValue = this.invoiceModel();

  const invoiceToSave: Invoice = {
    id: this.generateInvoiceId(),
    createdAt: formValue.createdAt,
    paymentDue: this.calculatePaymentDue(
      formValue.createdAt,
      Number(formValue.paymentTerms)
    ),
    description: formValue.description,
    paymentTerms: Number(formValue.paymentTerms),
    clientName: formValue.clientName,
    clientEmail: formValue.clientEmail,
    status: 'pending',
    senderAddress: formValue.senderAddress,
    clientAddress: formValue.clientAddress,
    items: formValue.items.map((item) => ({
      name: item.name,
      quantity: Number(item.quantity || 0),
      price: Number(item.price || 0),
      total: Number(item.quantity || 0) * Number(item.price || 0)
    })),
    total: this.getInvoiceTotal()
  };

  this.invoiceFormService.createInvoice(invoiceToSave)
    .pipe(
      tap((createdInvoice) => {
        console.log('Fattura creata:', createdInvoice);
        this.invoiceFormService.updateGetInvoices.next('')
      }),
      finalize(() => {
        this.invoiceFormService.closeForm();
        this.loaderService.hide()
      })
    )
    .subscribe();
}

protected saveChanges(): void {
  this.loaderService.show()
  const invoice = this.singleInvoice();

  if (!invoice) {
    return;
  }

  const formValue = this.invoiceModel();

  const invoiceToUpdate: Invoice = {
    id: invoice.id,
    createdAt: formValue.createdAt,
    paymentDue: this.calculatePaymentDue(
      formValue.createdAt,
      Number(formValue.paymentTerms)
    ),
    description: formValue.description,
    paymentTerms: Number(formValue.paymentTerms),
    clientName: formValue.clientName,
    clientEmail: formValue.clientEmail,
    status: invoice.status,
    senderAddress: formValue.senderAddress,
    clientAddress: formValue.clientAddress,
    items: formValue.items.map((item) => ({
      name: item.name,
      quantity: Number(item.quantity || 0),
      price: Number(item.price || 0),
      total: Number(item.quantity || 0) * Number(item.price || 0)
    })),
    total: this.getInvoiceTotal()
  };

  this.invoiceFormService.updateInvoice(invoice.id, invoiceToUpdate)
    .pipe(
      tap((updatedInvoice) => {
        console.log('Fattura aggiornata:', updatedInvoice);
        this.detailInvoiceService.updateSingleInvoice.next('')
      }),
      finalize(() => {
        this.invoiceFormService.closeForm();
        this.loaderService.hide()
      })
    )
    .subscribe();
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

  private generateInvoiceId(): string {
    const letters = Array.from({ length: 2 }, () =>
      String.fromCharCode(65 + Math.floor(Math.random() * 26))
    ).join('');

    const numbers = Math.floor(1000 + Math.random() * 9000);

    return `${letters}${numbers}`;
  }

  private calculatePaymentDue(createdAt: string, paymentTerms: number): string {
    const date = new Date(createdAt);

    date.setDate(date.getDate() + paymentTerms);

    return date.toISOString().split('T')[0];
  }
}