import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import {
  ChangePasswordRequest,
  UpdateInvoicePreferencesRequest,
  UpdateProfileRequest,
  UserSettings
} from './user-settings.model';

@Injectable({
  providedIn: 'root'
})
export class UserSettingsService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:8080/api/user-settings';

  getSettings() {
    return this.http.get<UserSettings>(this.apiUrl);
  }

  updateProfile(request: UpdateProfileRequest) {
    return this.http.put<UserSettings>(`${this.apiUrl}/profile`, request);
  }

  updateInvoicePreferences(request: UpdateInvoicePreferencesRequest) {
    return this.http.put<UserSettings>(`${this.apiUrl}/invoice-preferences`, request);
  }

  changePassword(request: ChangePasswordRequest) {
    return this.http.put<void>(`${this.apiUrl}/password`, request);
  }
}