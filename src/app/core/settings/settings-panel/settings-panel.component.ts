import { Component, computed, inject, OnInit, output, signal } from '@angular/core';
import {
  form,
  maxLength,
  minLength,
  pattern,
  required
} from '@angular/forms/signals';
import { EMPTY, catchError, finalize, tap } from 'rxjs';

import { AuthService } from '../../auth/auth.service';
import { AuthUser } from '../../auth/auth.model';
import { NotificationService } from '../../../shared/services/notification.service';
import { GenericInputComponent } from '../../../shared/components/generic-input/generic-input.component';
import { SelectInputComponent, SelectOption } from '../../../shared/components/select-input/select-input.component';

import { UserSettingsService } from '../user-settings.service';
import { UserSettings } from '../user-settings.model';

type SettingsTab = 'profile' | 'preferences' | 'security';

type ProfileSettingsForm = {
  fullName: string;
  avatarBase64: string;
  senderAddress: {
    street: string;
    city: string;
    postCode: string;
    country: string;
  };
};

type InvoicePreferencesForm = {
  defaultPaymentTerms: string;
};

type PasswordSettingsForm = {
  currentPassword: string;
  newPassword: string;
};

@Component({
  selector: 'app-settings-panel',
  imports: [
    GenericInputComponent,
    SelectInputComponent
  ],
  templateUrl: './settings-panel.component.html',
  styleUrl: './settings-panel.component.scss'
})
export class SettingsPanelComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly userSettingsService = inject(UserSettingsService);
  private readonly notificationService = inject(NotificationService);

  closed = output<void>();

  private readonly defaultAvatar = 'assets/images/logo.svg';

  protected readonly activeTab = signal<SettingsTab>('profile');
  protected readonly isLoading = signal(false);
  protected readonly avatarPreview = signal('');
  protected readonly avatarFileName = signal('');

  protected readonly paymentTermsOptions: SelectOption<string>[] = [
    { label: 'Entro 1 giorno', value: '1' },
    { label: 'Entro 7 giorni', value: '7' },
    { label: 'Entro 14 giorni', value: '14' },
    { label: 'Entro 30 giorni', value: '30' }
  ];

  protected readonly isProfileSubmitDisabled = computed(() => {
    return this.isLoading() || this.profileForm().invalid();
  });

  protected readonly isPreferencesSubmitDisabled = computed(() => {
    return this.isLoading() || this.preferencesForm().invalid();
  });

  protected readonly isPasswordSubmitDisabled = computed(() => {
    return this.isLoading() || this.passwordForm().invalid();
  });

  protected readonly profileModel = signal<ProfileSettingsForm>(this.getProfileInitialValue());

  protected readonly profileForm = form(this.profileModel, (schemaPath) => {
    required(schemaPath.fullName, {
      message: 'Nome obbligatorio'
    });

    minLength(schemaPath.fullName, 2, {
      message: 'Il nome deve contenere almeno 2 caratteri'
    });

    maxLength(schemaPath.fullName, 60, {
      message: 'Il nome non può superare 60 caratteri'
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

  protected readonly preferencesModel = signal<InvoicePreferencesForm>(this.getPreferencesInitialValue());

  protected readonly preferencesForm = form(this.preferencesModel, (schemaPath) => {
    required(schemaPath.defaultPaymentTerms, {
      message: 'Termini di pagamento obbligatori'
    });
  });

  protected readonly passwordModel = signal<PasswordSettingsForm>({
    currentPassword: '',
    newPassword: ''
  });

  protected readonly passwordForm = form(this.passwordModel, (schemaPath) => {
    required(schemaPath.currentPassword, {
      message: 'Password attuale obbligatoria'
    });

    required(schemaPath.newPassword, {
      message: 'Nuova password obbligatoria'
    });

    minLength(schemaPath.newPassword, 8, {
      message: 'La nuova password deve contenere almeno 8 caratteri'
    });
  });

  ngOnInit(): void {
    this.loadSettings();
  }

  protected setActiveTab(tab: SettingsTab): void {
    this.activeTab.set(tab);
  }

  protected closePanel(): void {
    this.closed.emit();
  }

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
      this.notificationService.error(
        'Formato non valido',
        'Puoi caricare solo immagini PNG, JPG o WEBP.'
      );

      this.avatarFileName.set('');
      input.value = '';
      return;
    }

    if (file.size > maxSizeInBytes) {
      this.notificationService.error(
        'Immagine troppo grande',
        'L’immagine non può superare 1MB.'
      );

      this.avatarFileName.set('');
      input.value = '';
      return;
    }

    this.avatarFileName.set(file.name);

    const reader = new FileReader();

    reader.onload = () => {
      const avatarBase64 = String(reader.result);

      this.profileModel.update((currentValue) => ({
        ...currentValue,
        avatarBase64
      }));

      this.avatarPreview.set(avatarBase64);
    };

    reader.readAsDataURL(file);
  }

  protected resetAvatar(): void {
    this.profileModel.update((currentValue) => ({
      ...currentValue,
      avatarBase64: this.defaultAvatar
    }));

    this.avatarPreview.set(this.defaultAvatar);
    this.avatarFileName.set('');
  }

  protected saveProfile(): void {
    if (this.profileForm().invalid()) {
      this.notificationService.warning(
        'Dati incompleti',
        'Completa correttamente i dati del profilo.'
      );

      return;
    }

    this.isLoading.set(true);

    this.userSettingsService.updateProfile(this.profileModel())
      .pipe(
        tap((settings) => {
          this.updateCurrentUser(settings);
          this.patchProfile(settings);

          this.notificationService.success(
            'Profilo aggiornato',
            'I dati del mittente sono stati aggiornati correttamente.'
          );
        }),
        catchError(() => {
          this.notificationService.error(
            'Aggiornamento non riuscito',
            'Non è stato possibile aggiornare il profilo.'
          );

          return EMPTY;
        }),
        finalize(() => {
          this.isLoading.set(false);
        })
      )
      .subscribe();
  }

  protected savePreferences(): void {
    if (this.preferencesForm().invalid()) {
      this.notificationService.warning(
        'Preferenze incomplete',
        'Seleziona i termini di pagamento predefiniti.'
      );

      return;
    }

    this.isLoading.set(true);

    this.userSettingsService.updateInvoicePreferences({
      defaultPaymentTerms: Number(this.preferencesModel().defaultPaymentTerms)
    })
      .pipe(
        tap((settings) => {
          this.updateCurrentUser(settings);
          this.patchPreferences(settings);

          this.notificationService.success(
            'Preferenze aggiornate',
            'Le preferenze fattura sono state salvate correttamente.'
          );
        }),
        catchError(() => {
          this.notificationService.error(
            'Salvataggio non riuscito',
            'Non è stato possibile salvare le preferenze fattura.'
          );

          return EMPTY;
        }),
        finalize(() => {
          this.isLoading.set(false);
        })
      )
      .subscribe();
  }

  protected changePassword(): void {
    if (this.passwordForm().invalid()) {
      this.notificationService.warning(
        'Password non valida',
        'Inserisci la password attuale e una nuova password di almeno 8 caratteri.'
      );

      return;
    }

    this.isLoading.set(true);

    this.userSettingsService.changePassword(this.passwordModel())
      .pipe(
        tap(() => {
          this.passwordModel.set({
            currentPassword: '',
            newPassword: ''
          });

          this.notificationService.success(
            'Password aggiornata',
            'La password è stata modificata correttamente.'
          );
        }),
        catchError(() => {
          this.notificationService.error(
            'Cambio password non riuscito',
            'La password attuale non è corretta oppure la nuova password non è valida.'
          );

          return EMPTY;
        }),
        finalize(() => {
          this.isLoading.set(false);
        })
      )
      .subscribe();
  }

  private loadSettings(): void {
    this.isLoading.set(true);

    this.userSettingsService.getSettings()
      .pipe(
        tap((settings) => {
          this.updateCurrentUser(settings);
          this.patchProfile(settings);
          this.patchPreferences(settings);
        }),
        catchError(() => {
          this.notificationService.error(
            'Impostazioni non disponibili',
            'Non è stato possibile recuperare le impostazioni utente.'
          );

          return EMPTY;
        }),
        finalize(() => {
          this.isLoading.set(false);
        })
      )
      .subscribe();
  }

  private patchProfile(settings: UserSettings): void {
    this.profileModel.set({
      fullName: settings.fullName,
      avatarBase64: settings.avatarBase64,
      senderAddress: {
        street: settings.senderAddress.street,
        city: settings.senderAddress.city,
        postCode: settings.senderAddress.postCode,
        country: settings.senderAddress.country
      }
    });

    this.avatarPreview.set(settings.avatarBase64 || this.defaultAvatar);
  }

  private patchPreferences(settings: UserSettings): void {
    this.preferencesModel.set({
      defaultPaymentTerms: String(settings.defaultPaymentTerms ?? 30)
    });
  }

  private updateCurrentUser(settings: UserSettings): void {
    const user: AuthUser = {
      userId: settings.userId,
      fullName: settings.fullName,
      email: settings.email,
      avatarBase64: settings.avatarBase64,
      senderAddress: settings.senderAddress,
      defaultPaymentTerms: settings.defaultPaymentTerms
    };

    this.authService.updateCurrentUser(user);
  }

  private getProfileInitialValue(): ProfileSettingsForm {
    const currentUser = this.authService.currentUser();

    return {
      fullName: currentUser?.fullName ?? '',
      avatarBase64: currentUser?.avatarBase64 ?? this.defaultAvatar,
      senderAddress: {
        street: currentUser?.senderAddress?.street ?? '',
        city: currentUser?.senderAddress?.city ?? '',
        postCode: currentUser?.senderAddress?.postCode ?? '',
        country: currentUser?.senderAddress?.country ?? ''
      }
    };
  }

  private getPreferencesInitialValue(): InvoicePreferencesForm {
    const currentUser = this.authService.currentUser();

    return {
      defaultPaymentTerms: String(currentUser?.defaultPaymentTerms ?? 30)
    };
  }
}