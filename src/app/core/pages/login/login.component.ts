import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  email,
  form,
  maxLength,
  minLength,
  required
} from '@angular/forms/signals';
import { catchError, EMPTY, finalize, tap } from 'rxjs';

import { AuthService } from '../../auth/auth.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { GenericInputComponent } from '../../../shared/components/generic-input/generic-input.component';

type LoginForm = {
  email: string;
  password: string;
};

@Component({
  selector: 'app-login',
  imports: [GenericInputComponent,  RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly notificationService = inject(NotificationService);

  protected readonly isLoading = signal(false);
  protected readonly submitted = signal(false);
  protected readonly errorMessage = signal('');

  protected readonly loginModel = signal<LoginForm>({
    email: '',
    password: ''
  });

  protected readonly loginForm = form(this.loginModel, (schemaPath) => {
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
  });

  protected readonly isSubmitDisabled = computed(() => {
    return this.isLoading() || this.loginForm().invalid();
  });

  protected login(): void {
    this.submitted.set(true);

    if (this.loginForm().invalid()) {
      return;
    }

    this.errorMessage.set('');
    this.isLoading.set(true);

    this.authService.login(this.loginModel())
      .pipe(
        tap(() => {
          this.notificationService.success(
            'Accesso effettuato',
            'Bentornato su InvoiceFlow.'
          );

          this.router.navigateByUrl('/');
        }),
        catchError(() => {
          this.notificationService.error(
            'Accesso non riuscito',
            'Email o password non validi.'
          );

          this.errorMessage.set('Email o password non validi');

          return EMPTY;
        }),
        finalize(() => {
          this.isLoading.set(false);
        })
      )
      .subscribe();
  }
}