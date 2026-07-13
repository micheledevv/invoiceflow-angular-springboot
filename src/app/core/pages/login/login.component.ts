import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { email, form, FormField, required } from '@angular/forms/signals';
import { finalize } from 'rxjs';

import { AuthService } from '../../auth/auth.service';
import { NotificationService } from '../../../shared/services/notification.service';

type LoginForm = {
  email: string;
  password: string;
};

@Component({
  selector: 'app-login',
  imports: [FormField, RouterLink],
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

  protected readonly isSubmitDisabled = computed(() => {
   return this.isLoading() || this.loginForm().invalid();
  });

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

    required(schemaPath.password, {
      message: 'Password obbligatoria'
    });
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
        finalize(() => {
          this.isLoading.set(false);
        })
      )
      .subscribe({
        next: () => {
          this.router.navigateByUrl('/');
        },
        error: () => {
          this.errorMessage.set('Email o password non validi');
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