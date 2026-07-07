import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { email, form, FormField, minLength, required } from '@angular/forms/signals';
import { finalize } from 'rxjs';

import { AuthService } from '../../auth/auth.service';

type RegisterForm = {
  fullName: string;
  email: string;
  password: string;
  avatarBase64: string;
};

@Component({
  selector: 'app-register',
  imports: [FormField, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly isLoading = signal(false);
  protected readonly submitted = signal(false);
  protected readonly errorMessage = signal('');
  protected readonly avatarPreview = signal('');
  protected readonly avatarFileName = signal('');

  protected readonly isSubmitDisabled = computed(() => {
   return this.isLoading() || this.registerForm().invalid();
  });

  protected readonly registerModel = signal<RegisterForm>({
    fullName: '',
    email: '',
    password: '',
    avatarBase64: ''
  });

  protected readonly registerForm = form(this.registerModel, (schemaPath) => {
    required(schemaPath.fullName, {
      message: 'Nome obbligatorio'
    });

    required(schemaPath.email, {
      message: 'Email obbligatoria'
    });

    email(schemaPath.email, {
      message: 'Email non valida'
    });

    required(schemaPath.password, {
      message: 'Password obbligatoria'
    });

    minLength(schemaPath.password, 8, {
      message: 'La password deve contenere almeno 8 caratteri'
    });

    required(schemaPath.avatarBase64, {
      message: 'Immagine profilo obbligatoria'
    });
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

    this.errorMessage.set('');
    this.isLoading.set(true);

    this.authService.register(this.registerModel())
      .pipe(
        finalize(() => {
          this.isLoading.set(false);
        })
      )
      .subscribe({
        next: () => {
          this.router.navigateByUrl('/');
        },
        error: () => {
          this.errorMessage.set('Registrazione non riuscita. Controlla i dati inseriti.');
        }
      });
  }

  protected getFieldError(field: any): string {
    const state = field();

    if (!this.submitted() && !state.touched()) {
      return '';
    }

    if (!state.invalid()) {
      return '';
    }

    return state.errors()[0]?.message ?? 'Campo non valido';
  }
}