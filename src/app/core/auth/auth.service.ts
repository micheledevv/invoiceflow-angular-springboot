import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';

import { AuthRequest, AuthResponse, AuthUser, RegisterRequest } from './auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:8080/api/auth';
  private readonly tokenKey = 'invoiceflow_token';
  private readonly userKey = 'invoiceflow_user';

  private readonly currentUserSignal = signal<AuthUser | null>(this.getUserFromStorage());

  readonly currentUser = this.currentUserSignal.asReadonly();

  readonly isLoggedIn = computed(() => {
    return !!this.getToken();
  });

  register(request: RegisterRequest) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, request)
      .pipe(
        tap((response) => {
          this.saveAuthData(response);
        })
      );
  }

  login(request: AuthRequest) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, request)
      .pipe(
        tap((response) => {
          this.saveAuthData(response);
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.currentUserSignal.set(null);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  updateCurrentUser(user: AuthUser): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
    this.currentUserSignal.set(user);
  }

  private saveAuthData(response: AuthResponse): void {
    const user: AuthUser = {
      userId: response.userId,
      fullName: response.fullName,
      email: response.email,
      avatarBase64: response.avatarBase64,
      senderAddress: response.senderAddress,
      defaultPaymentTerms: response.defaultPaymentTerms
    };

    localStorage.setItem(this.tokenKey, response.token);
    localStorage.setItem(this.userKey, JSON.stringify(user));

    this.currentUserSignal.set(user);
  }

  private getUserFromStorage(): AuthUser | null {
    const user = localStorage.getItem(this.userKey);

    if (!user) {
      return null;
    }

    try {
      return JSON.parse(user) as AuthUser;
    } catch {
      localStorage.removeItem(this.userKey);
      return null;
    }
  }
}