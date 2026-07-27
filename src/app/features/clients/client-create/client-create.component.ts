import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, EMPTY, finalize, tap } from 'rxjs';

import { ClientFormComponent } from '../components/client-form/client-form.component';
import { CreateClientRequest } from '../models/client.model';
import { ClientsService } from '../services/clients.service';
import { NotificationService } from '../../../shared/services/notification.service';

@Component({
  selector: 'app-client-create',
  imports: [ClientFormComponent],
  templateUrl: './client-create.component.html',
  styleUrl: './client-create.component.scss'
})
export class ClientCreateComponent {
  private readonly clientsService = inject(ClientsService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);

  protected readonly isSubmitting = signal(false);

  protected createClient(request: CreateClientRequest): void {
    this.isSubmitting.set(true);

    this.clientsService.createClient(request)
      .pipe(
        tap((createdClient) => {
          this.notificationService.success(
            'Cliente creato',
            'Il nuovo cliente è stato aggiunto correttamente.'
          );

          this.router.navigate(['/clients', createdClient.id]);
        }),
        catchError(() => {
          this.notificationService.error(
            'Creazione non riuscita',
            'Non è stato possibile creare il cliente.'
          );

          return EMPTY;
        }),
        finalize(() => {
          this.isSubmitting.set(false);
        })
      )
      .subscribe();
  }

  protected cancel(): void {
    this.router.navigateByUrl('/clients');
  }
}