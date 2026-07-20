import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  email,
  form,
  maxLength,
  minLength,
  pattern,
  required
} from '@angular/forms/signals';
import { catchError, EMPTY, finalize, tap } from 'rxjs';

import { AuthService } from '../../auth/auth.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { GenericInputComponent } from '../../../shared/components/generic-input/generic-input.component';

type RegisterForm = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  avatarBase64: string;
  senderAddress: {
    street: string;
    city: string;
    postCode: string;
    country: string;
  };
};

type RegisterPayload = Omit<RegisterForm, 'confirmPassword'>;

@Component({
  selector: 'app-register',
  imports: [GenericInputComponent, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly notificationService = inject(NotificationService);

  protected readonly isLoading = signal(false);
  protected readonly submitted = signal(false);
  protected readonly errorMessage = signal('');
  protected readonly avatarFileName = signal('');

  private readonly defaultAvatar = 'assets/images/logo.svg';

  protected readonly avatarPreview = signal('');

  protected readonly registerModel = signal<RegisterForm>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    avatarBase64: this.defaultAvatar,
    senderAddress: {
      street: '',
      city: '',
      postCode: '',
      country: ''
    }
  });

  protected readonly registerForm = form(this.registerModel, (schemaPath) => {
    required(schemaPath.fullName, {
      message: 'Nome obbligatorio'
    });

    minLength(schemaPath.fullName, 2, {
      message: 'Il nome deve contenere almeno 2 caratteri'
    });

    maxLength(schemaPath.fullName, 60, {
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

    required(schemaPath.password, {
      message: 'Password obbligatoria'
    });

    minLength(schemaPath.password, 8, {
      message: 'La password deve contenere almeno 8 caratteri'
    });

    required(schemaPath.confirmPassword, {
      message: 'Conferma password obbligatoria'
    });

    minLength(schemaPath.confirmPassword, 8, {
      message: 'La conferma password deve contenere almeno 8 caratteri'
    });

    required(schemaPath.senderAddress.street, {
      message: 'Indirizzo obbligatorio'
    });

    minLength(schemaPath.senderAddress.street, 5, {
      message: 'L’indirizzo deve contenere almeno 5 caratteri'
    });

    maxLength(schemaPath.senderAddress.street, 80, {
      message: 'L’indirizzo non può superare 80 caratteri'
    });

    required(schemaPath.senderAddress.city, {
      message: 'Città obbligatoria'
    });

    minLength(schemaPath.senderAddress.city, 2, {
      message: 'La città deve contenere almeno 2 caratteri'
    });

    maxLength(schemaPath.senderAddress.city, 40, {
      message: 'La città non può superare 40 caratteri'
    });

    required(schemaPath.senderAddress.postCode, {
      message: 'CAP obbligatorio'
    });

    maxLength(schemaPath.senderAddress.postCode, 5, {
      message: 'Il CAP deve contenere al massimo 5 numeri'
    });

    pattern(schemaPath.senderAddress.postCode, /^[0-9]{5}$/, {
      message: 'Il CAP deve contenere 5 numeri'
    });

    required(schemaPath.senderAddress.country, {
      message: 'Paese obbligatorio'
    });

    minLength(schemaPath.senderAddress.country, 2, {
      message: 'Il paese deve contenere almeno 2 caratteri'
    });

    maxLength(schemaPath.senderAddress.country, 40, {
      message: 'Il paese non può superare 40 caratteri'
    });
  });

  protected readonly passwordsDoNotMatch = computed(() => {
    const formValue = this.registerModel();

    if (!formValue.password || !formValue.confirmPassword) {
      return false;
    }

    return formValue.password !== formValue.confirmPassword;
  });

  protected readonly confirmPasswordMismatchError = computed(() => {
    const confirmPasswordState = this.registerForm.confirmPassword();

    if (!this.submitted() && !confirmPasswordState.touched()) {
      return '';
    }

    if (!this.passwordsDoNotMatch()) {
      return '';
    }

    return 'Le password non coincidono';
  });

  protected readonly isRegisterButtonDisabled = computed(() => {
    return this.isLoading() ||
      this.registerForm().invalid() ||
      this.passwordsDoNotMatch();
  });

  protected onAvatarSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      this.avatarFileName.set('');
      return;
    }

    const allowedTypes = ['image/png', 'image/jpeg', 'image/webp'];
    const maxSizeInMb = 1;
    const maxSizeInBytes = maxSizeInMb * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      this.errorMessage.set('Puoi caricare solo immagini PNG, JPG o WEBP');
      this.avatarFileName.set('');
      input.value = '';
      return;
    }

    if (file.size > maxSizeInBytes) {
      this.errorMessage.set('L’immagine non può superare 1MB');
      this.avatarFileName.set('');
      input.value = '';
      return;
    }

    this.avatarFileName.set(file.name);

    const reader = new FileReader();

    reader.onload = () => {
      const avatarBase64 = String(reader.result);

      this.registerModel.update((currentValue) => ({
        ...currentValue,
        avatarBase64
      }));

      this.avatarPreview.set(avatarBase64);
      this.errorMessage.set('');
    };

    reader.readAsDataURL(file);
  }

  protected register(): void {
    this.submitted.set(true);

    if (this.registerForm().invalid()) {
      return;
    }

    if (this.passwordsDoNotMatch()) {
      this.errorMessage.set('Le password non coincidono');
      return;
    }

    this.errorMessage.set('');
    this.isLoading.set(true);

    this.authService.register(this.buildRegisterPayload())
      .pipe(
        tap(() => {
          this.notificationService.success(
            'Account creato',
            'Registrazione completata con successo.'
          );

          this.router.navigateByUrl('/');
        }),
        catchError(() => {
          this.notificationService.error(
            'Registrazione non riuscita',
            'Controlla i dati inseriti e riprova.'
          );

          this.errorMessage.set('Registrazione non riuscita. Controlla i dati inseriti.');

          return EMPTY;
        }),
        finalize(() => {
          this.isLoading.set(false);
        })
      )
      .subscribe();
  }

  private buildRegisterPayload(): RegisterPayload {
    const {
      confirmPassword,
      ...payload
    } = this.registerModel();

    return payload;
  }
}