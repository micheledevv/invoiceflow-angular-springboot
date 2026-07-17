import { Component, computed, inject, OnInit, signal } from '@angular/core';
import {
  applyEach,
  email,
  form,
  maxLength,
  minLength,
  pattern,
  required,
  readonly
} from '@angular/forms/signals';
import { catchError, EMPTY, finalize, tap } from 'rxjs';

import { GenericInputComponent } from '../../../../shared/components/generic-input/generic-input.component';
import { SelectInputComponent, SelectOption } from '../../../../shared/components/select-input/select-input.component';
import { CalendarInputComponent } from '../../../../shared/components/calendar-input/calendar-input.component';
import { ActionsButtonComponent } from '../../../../shared/components/actions-button/actions-button.component';
import { LoaderService } from '../../../../shared/components/loader/loader.service';

import { InvoiceFormService } from './invoice-form.service';
import { DetailInvoiceService } from '../../pages/detail-invoice/detail-invoice.service';

import { Invoice, InvoiceStatus } from '../../models/invoice.model';
import { InvoiceFormModel } from '../../models/invoice.form.model';
import { EuroCurrencyPipe } from '../../../../shared/pipes/euro-currency.pipe';
import { AuthService } from '../../../../core/auth/auth.service';
import { NotificationService } from '../../../../shared/services/notification.service';

@Component({
  selector: 'app-invoice-form',
  imports: [
    GenericInputComponent,
    SelectInputComponent,
    CalendarInputComponent,
    ActionsButtonComponent,
    EuroCurrencyPipe
  ],
  templateUrl: './invoice-form.component.html',
  styleUrl: './invoice-form.component.scss'
})
export class InvoiceFormComponent implements OnInit {
  private readonly invoiceFormService = inject(InvoiceFormService);
  private readonly detailInvoiceService = inject(DetailInvoiceService);
  private readonly loaderService = inject(LoaderService);
  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);

  private readonly maxItems = 10;

  protected readonly mode = this.invoiceFormService.mode;
  protected readonly singleInvoice = this.detailInvoiceService.singleInvoice;

  protected readonly paymentTermsOptions: SelectOption<string>[] = [
    { label: 'Entro 1 giorno', value: '1' },
    { label: 'Entro 7 giorni', value: '7' },
    { label: 'Entro 14 giorni', value: '14' },
    { label: 'Entro 30 giorni', value: '30' }
  ];

  protected readonly invoiceModel = signal<InvoiceFormModel>(this.getEmptyForm());

  protected readonly invoiceForm = form(this.invoiceModel, (schemaPath) => {
    readonly(schemaPath.senderName);
    readonly(schemaPath.senderAddress.street);
    readonly(schemaPath.senderAddress.city);
    readonly(schemaPath.senderAddress.postCode);
    readonly(schemaPath.senderAddress.country);

    required(schemaPath.senderName, {
      message: 'Il nome del mittente è obbligatorio'
    });

    minLength(schemaPath.senderName, 2, {
      message: 'Il nome del mittente deve contenere almeno 2 caratteri'
    });

    maxLength(schemaPath.senderName, 60, {
      message: 'Il nome del mittente non può superare 60 caratteri'
    });

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

    required(schemaPath.clientName, {
      message: 'Il nome cliente è obbligatorio'
    });

    minLength(schemaPath.clientName, 2, {
      message: 'Il nome cliente deve contenere almeno 2 caratteri'
    });

    maxLength(schemaPath.clientName, 50, {
      message: 'Il nome cliente non può superare 50 caratteri'
    });

    required(schemaPath.clientEmail, {
      message: 'L’email cliente è obbligatoria'
    });

    email(schemaPath.clientEmail, {
      message: 'Inserisci un’email valida'
    });

    maxLength(schemaPath.clientEmail, 80, {
      message: 'L’email cliente non può superare 80 caratteri'
    });

    required(schemaPath.clientAddress.street, {
      message: 'L’indirizzo del cliente è obbligatorio'
    });

    minLength(schemaPath.clientAddress.street, 5, {
      message: 'L’indirizzo cliente deve contenere almeno 5 caratteri'
    });

    maxLength(schemaPath.clientAddress.street, 70, {
      message: 'L’indirizzo cliente non può superare 70 caratteri'
    });

    required(schemaPath.clientAddress.city, {
      message: 'La città del cliente è obbligatoria'
    });

    minLength(schemaPath.clientAddress.city, 2, {
      message: 'La città deve contenere almeno 2 caratteri'
    });

    maxLength(schemaPath.clientAddress.city, 35, {
      message: 'La città non può superare 35 caratteri'
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

    maxLength(schemaPath.clientAddress.country, 35, {
      message: 'Il paese non può superare 35 caratteri'
    });

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

    maxLength(schemaPath.description, 80, {
      message: 'La descrizione non può superare 80 caratteri'
    });

    applyEach(schemaPath.items, (itemPath) => {
      required(itemPath.name, {
        message: 'Il nome articolo è obbligatorio'
      });

      minLength(itemPath.name, 2, {
        message: 'Il nome articolo deve contenere almeno 2 caratteri'
      });

      maxLength(itemPath.name, 50, {
        message: 'Il nome articolo non può superare 50 caratteri'
      });

      required(itemPath.quantity, {
        message: 'La quantità è obbligatoria'
      });

      pattern(itemPath.quantity, /^[1-9][0-9]{0,2}$/, {
        message: 'La quantità deve essere compresa tra 1 e 999'
      });

      required(itemPath.price, {
        message: 'Il prezzo è obbligatorio'
      });

      pattern(itemPath.price, /^(?!0+(?:[.,]0{1,2})?$)\d{1,5}(?:[.,]\d{1,2})?$/, {
        message: 'Il prezzo deve essere compreso tra 0,01 e 99999,99'
      });
    });
  });

  protected readonly title = computed(() => {
    const invoice = this.singleInvoice();

    if (this.mode() === 'create') {
      return 'Crea fattura';
    }

    return invoice ? `Modifica #${invoice.id}` : 'Modifica fattura';
  });

  protected readonly isFormInvalid = computed(() => {
    return this.invoiceForm().invalid();
  });

  protected readonly canRemoveItem = computed(() => {
    return this.invoiceModel().items.length > 1;
  });

  protected readonly canAddItem = computed(() => {
    return this.invoiceModel().items.length < this.maxItems;
  });

  ngOnInit(): void {
    this.initializeForm();
  }

  protected addItem(): void {
    if (!this.canAddItem()) {
      this.notificationService.warning(
        'Limite articoli raggiunto',
        `Puoi aggiungere al massimo ${this.maxItems} articoli per fattura.`
      );

      return;
    }

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
    if (!this.canRemoveItem()) {
      this.notificationService.warning(
        'Articolo obbligatorio',
        'La fattura deve contenere almeno un articolo.'
      );

      return;
    }

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

    return this.calculateItemTotal(item.quantity, item.price);
  }

  protected closeForm(): void {
    this.invoiceFormService.closeForm();
  }

  protected saveAndSend(): void {
    if (this.isFormInvalid()) {
      this.notificationService.warning(
        'Dati incompleti',
        'Completa tutti i campi obbligatori prima di inviare la fattura.'
      );

      return;
    }

    this.loaderService.show();

    const invoiceToSave = this.buildInvoicePayload({
      id: this.generateInvoiceId(),
      status: 'pending'
    });

    this.invoiceFormService.createInvoice(invoiceToSave)
      .pipe(
        tap((createdInvoice) => {
          console.log('Fattura creata:', createdInvoice);

          this.invoiceFormService.notifyInvoicesUpdated();

          this.notificationService.success(
            'Fattura creata',
            `La fattura #${createdInvoice.id} è stata creata e inviata correttamente.`
          );

          this.invoiceFormService.closeForm();
        }),
        catchError(() => {
          this.notificationService.error(
            'Creazione non riuscita',
            'Non è stato possibile creare la fattura.'
          );

          return EMPTY;
        }),
        finalize(() => {
          this.loaderService.hide();
        })
      )
      .subscribe();
  }

  protected saveChanges(): void {
    if (this.isFormInvalid()) {
      this.notificationService.warning(
        'Dati incompleti',
        'Completa tutti i campi obbligatori prima di salvare le modifiche.'
      );

      return;
    }

    const currentInvoice = this.singleInvoice();

    if (!currentInvoice) {
      this.notificationService.error(
        'Fattura non trovata',
        'Non è stato possibile recuperare la fattura da modificare.'
      );

      return;
    }

    this.loaderService.show();

    const invoiceToUpdate = this.buildInvoicePayload({
      id: currentInvoice.id,
      status: currentInvoice.status
    });

    this.invoiceFormService.updateInvoice(currentInvoice.id, invoiceToUpdate)
      .pipe(
        tap((updatedInvoice) => {
          console.log('Fattura aggiornata:', updatedInvoice);

          this.detailInvoiceService.notifySingleInvoiceUpdated();

          this.notificationService.success(
            'Fattura aggiornata',
            `La fattura #${updatedInvoice.id} è stata aggiornata correttamente.`
          );

          this.invoiceFormService.closeForm();
        }),
        catchError(() => {
          this.notificationService.error(
            'Aggiornamento non riuscito',
            `Non è stato possibile aggiornare la fattura #${currentInvoice.id}.`
          );

          return EMPTY;
        }),
        finalize(() => {
          this.loaderService.hide();
        })
      )
      .subscribe();
  }

  protected saveAsDraft(): void {
    if (this.isFormInvalid()) {
      this.notificationService.warning(
        'Dati incompleti',
        'Completa tutti i campi obbligatori prima di salvare la bozza.'
      );

      return;
    }

    this.loaderService.show();

    const invoiceToSave = this.buildInvoicePayload({
      id: this.generateInvoiceId(),
      status: 'draft'
    });

    this.invoiceFormService.createInvoice(invoiceToSave)
      .pipe(
        tap((createdInvoice) => {
          console.log('Fattura salvata come bozza:', createdInvoice);

          this.invoiceFormService.notifyInvoicesUpdated();

          this.notificationService.success(
            'Bozza salvata',
            `La fattura #${createdInvoice.id} è stata salvata come bozza.`
          );

          this.invoiceFormService.closeForm();
        }),
        catchError(() => {
          this.notificationService.error(
            'Salvataggio non riuscito',
            'Non è stato possibile salvare la fattura come bozza.'
          );

          return EMPTY;
        }),
        finalize(() => {
          this.loaderService.hide();
        })
      )
      .subscribe();
  }

  private initializeForm(): void {
    if (this.mode() === 'edit') {
      const invoice = this.singleInvoice();

      if (invoice) {
        this.patchFormWithInvoice(invoice);
      }

      return;
    }

    this.resetForm();
  }

  private buildInvoicePayload(config: {
    id: string;
    status: InvoiceStatus;
  }): Invoice {
    const formValue = this.invoiceModel();
    const paymentTerms = Number(formValue.paymentTerms);

    return {
      id: config.id,
      createdAt: formValue.createdAt,
      paymentDue: this.calculatePaymentDue(formValue.createdAt, paymentTerms),
      description: formValue.description.trim(),
      paymentTerms,
      clientName: formValue.clientName.trim(),
      clientEmail: formValue.clientEmail.trim(),
      senderName: formValue.senderName.trim(),
      status: config.status,
      senderAddress: {
        street: formValue.senderAddress.street.trim(),
        city: formValue.senderAddress.city.trim(),
        postCode: formValue.senderAddress.postCode.trim(),
        country: formValue.senderAddress.country.trim()
      },
      clientAddress: {
        street: formValue.clientAddress.street.trim(),
        city: formValue.clientAddress.city.trim(),
        postCode: formValue.clientAddress.postCode.trim(),
        country: formValue.clientAddress.country.trim()
      },
      items: formValue.items.map((item) => ({
        name: item.name.trim(),
        quantity: this.parseNumberValue(item.quantity),
        price: this.parseNumberValue(item.price),
        total: this.calculateItemTotal(item.quantity, item.price)
      })),
      total: this.getInvoiceTotal()
    };
  }

  private getInvoiceTotal(): number {
    return this.invoiceModel().items.reduce((total, item) => {
      return total + this.calculateItemTotal(item.quantity, item.price);
    }, 0);
  }

  private calculateItemTotal(quantity: string, price: string): number {
    return this.parseNumberValue(quantity) * this.parseNumberValue(price);
  }

  private parseNumberValue(value: string): number {
    return Number(String(value || '0').replace(',', '.'));
  }

  private patchFormWithInvoice(invoice: Invoice): void {
    this.invoiceModel.set({
      senderName: invoice.senderName ?? '',

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
    const currentUser = this.authService.currentUser();

    return {
      senderName: currentUser?.fullName ?? '',

      senderAddress: {
        street: currentUser?.senderAddress?.street ?? '',
        city: currentUser?.senderAddress?.city ?? '',
        postCode: currentUser?.senderAddress?.postCode ?? '',
        country: currentUser?.senderAddress?.country ?? ''
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
      paymentTerms: String(currentUser?.defaultPaymentTerms ?? 30),
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