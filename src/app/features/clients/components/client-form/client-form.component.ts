import { Component, computed, input, linkedSignal, output } from '@angular/core';
import {
  email,
  form,
  maxLength,
  minLength,
  pattern,
  required
} from '@angular/forms/signals';

import { GenericInputComponent } from '../../../../shared/components/generic-input/generic-input.component';
import { ClientFormValue } from '../../models/client.model';

@Component({
  selector: 'app-client-form',
  imports: [GenericInputComponent],
  templateUrl: './client-form.component.html',
  styleUrl: './client-form.component.scss'
})
export class ClientFormComponent {
  readonly initialValue = input<ClientFormValue | null>(null);
  readonly submitLabel = input('Salva cliente');
  readonly isSubmitting = input(false);

  readonly formSubmit = output<ClientFormValue>();
  readonly cancelled = output<void>();

  protected readonly clientModel = linkedSignal(() => {
    return this.initialValue() ?? this.getEmptyClientFormValue();
  });

  protected readonly clientForm = form(this.clientModel, (schemaPath) => {
    required(schemaPath.name, {
      message: 'Nome cliente obbligatorio'
    });

    minLength(schemaPath.name, 2, {
      message: 'Il nome deve contenere almeno 2 caratteri'
    });

    maxLength(schemaPath.name, 60, {
      message: 'Il nome non può superare 60 caratteri'
    });

    required(schemaPath.email, {
      message: 'Email obbligatoria'
    });

    email(schemaPath.email, {
      message: 'Email non valida'
    });

    maxLength(schemaPath.email, 80, {
      message: 'L’email non può superare 80 caratteri'
    });

    maxLength(schemaPath.phone, 20, {
      message: 'Il telefono non può superare 20 caratteri'
    });

    maxLength(schemaPath.vatNumber, 20, {
      message: 'La partita IVA non può superare 20 caratteri'
    });

    maxLength(schemaPath.taxCode, 20, {
      message: 'Il codice fiscale non può superare 20 caratteri'
    });

    required(schemaPath.address.street, {
      message: 'Indirizzo obbligatorio'
    });

    minLength(schemaPath.address.street, 5, {
      message: 'L’indirizzo deve contenere almeno 5 caratteri'
    });

    maxLength(schemaPath.address.street, 80, {
      message: 'L’indirizzo non può superare 80 caratteri'
    });

    required(schemaPath.address.city, {
      message: 'Città obbligatoria'
    });

    minLength(schemaPath.address.city, 2, {
      message: 'La città deve contenere almeno 2 caratteri'
    });

    maxLength(schemaPath.address.city, 40, {
      message: 'La città non può superare 40 caratteri'
    });

    required(schemaPath.address.postCode, {
      message: 'CAP obbligatorio'
    });

    pattern(schemaPath.address.postCode, /^[0-9]{5}$/, {
      message: 'Il CAP deve contenere 5 numeri'
    });

    required(schemaPath.address.country, {
      message: 'Paese obbligatorio'
    });

    minLength(schemaPath.address.country, 2, {
      message: 'Il paese deve contenere almeno 2 caratteri'
    });

    maxLength(schemaPath.address.country, 40, {
      message: 'Il paese non può superare 40 caratteri'
    });

    maxLength(schemaPath.notes, 250, {
      message: 'Le note non possono superare 250 caratteri'
    });
  });

  protected readonly submitIsDisabled = computed(() => {
    return this.isSubmitting() || this.clientForm().invalid();
  });

  protected updateNotes(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;

    this.clientModel.update((currentValue) => ({
      ...currentValue,
      notes: textarea.value
    }));
  }

  protected submitForm(): void {
    if (this.clientForm().invalid()) {
      return;
    }

    this.formSubmit.emit(this.buildPayload());
  }

  private buildPayload(): ClientFormValue {
    const value = this.clientModel();

    return {
      name: this.normalize(value.name),
      email: value.email.trim().toLowerCase(),
      phone: value.phone.trim(),
      vatNumber: value.vatNumber.trim(),
      taxCode: value.taxCode.trim(),
      address: {
        street: this.normalize(value.address.street),
        city: this.normalize(value.address.city),
        postCode: value.address.postCode.trim(),
        country: this.normalize(value.address.country)
      },
      notes: value.notes.trim()
    };
  }

  private getEmptyClientFormValue(): ClientFormValue {
    return {
      name: '',
      email: '',
      phone: '',
      vatNumber: '',
      taxCode: '',
      address: {
        street: '',
        city: '',
        postCode: '',
        country: ''
      },
      notes: ''
    };
  }

  private normalize(value: string): string {
    return value.trim().replaceAll(/\s+/g, ' ');
  }
}