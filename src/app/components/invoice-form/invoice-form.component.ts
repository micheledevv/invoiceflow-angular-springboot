import { Component, inject, signal } from '@angular/core';
import { GenericInputComponent } from '../../shared/components/generic-input/generic-input.component';
import { SelectInputComponent, SelectOption } from '../../shared/components/select-input/select-input.component';
import { CalendarInputComponent } from '../../shared/components/calendar-input/calendar-input.component';
import { ActionsButtonComponent } from '../../shared/components/actions-button/actions-button.component';
import { InvoiceFormService } from './invoice-form.service';

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
export class InvoiceFormComponent {
  constructor(){}
  private invoiceFormService = inject(InvoiceFormService);

  mode = this.invoiceFormService.mode;

  paymentTermsOptions: SelectOption<number>[] = [
    { label: 'Net 1 Giorno', value: 1 },
    { label: 'Net 7 Giorni', value: 7 },
    { label: 'Net 14 Giorni', value: 14 },
    { label: 'Net 30 Giorni', value: 30 }
  ];

  form = signal({
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
    paymentTerms: 30,
    description: ''
  });

  updateSenderAddressField(
    field: 'street' | 'city' | 'postCode' | 'country',
    value: string
  ): void {
    this.form.update(current => ({
      ...current,
      senderAddress: {
        ...current.senderAddress,
        [field]: value
      }
    }));
  }

  updateClientAddressField(
    field: 'street' | 'city' | 'postCode' | 'country',
    value: string
  ): void {
    this.form.update(current => ({
      ...current,
      clientAddress: {
        ...current.clientAddress,
        [field]: value
      }
    }));
  }

  updateField<K extends keyof ReturnType<typeof this.form>>(
    field: K,
    value: ReturnType<typeof this.form>[K]
  ): void {
    this.form.update(current => ({
      ...current,
      [field]: value
    }));
  }

  updatePaymentTerms(value: string | number): void {
    this.updateField('paymentTerms', Number(value));
  }

  closeForm(){
    console.log('chiuso il form')
    this.invoiceFormService.closeForm()
  }

  saveAndSend(){
    console.log(this.form())
  }
  
}