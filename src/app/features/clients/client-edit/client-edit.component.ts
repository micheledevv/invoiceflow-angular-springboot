import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, EMPTY, finalize, tap } from 'rxjs';

import { Client, ClientFormValue, UpdateClientRequest } from '../models/client.model';
import { ClientFormComponent } from '../components/client-form/client-form.component';
import { ClientsService } from '../services/clients.service';
import { LoaderService } from '../../../shared/components/loader/loader.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { MessagesLoader } from '../../../shared/components/loader/models/text.messages.model';

@Component({
  selector: 'app-client-edit',
  imports: [ClientFormComponent],
  templateUrl: './client-edit.component.html',
  styleUrl: './client-edit.component.scss'
})
export class ClientEditComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly clientsService = inject(ClientsService);
  private readonly loaderService = inject(LoaderService);
  private readonly notificationService = inject(NotificationService);

  protected readonly client = signal<Client | null>(null);
  protected readonly isSubmitting = signal(false);

  protected readonly clientFormValue = computed<ClientFormValue | null>(() => {
    const selectedClient = this.client();

    if (!selectedClient) {
      return null;
    }

    return {
      name: selectedClient.name,
      email: selectedClient.email,
      phone: selectedClient.phone ?? '',
      vatNumber: selectedClient.vatNumber ?? '',
      taxCode: selectedClient.taxCode ?? '',
      address: {
        street: selectedClient.address.street,
        city: selectedClient.address.city,
        postCode: selectedClient.address.postCode,
        country: selectedClient.address.country
      },
      notes: selectedClient.notes ?? ''
    };
  });

  ngOnInit(): void {
    const clientId = this.route.snapshot.paramMap.get('id');

    if (!clientId) {
      this.notificationService.error(
        'Cliente non valido',
        'Non è stato possibile recuperare il cliente da modificare.'
      );

      this.router.navigateByUrl('/clients');
      return;
    }

    this.loadClient(clientId);
  }

  protected updateClient(request: UpdateClientRequest): void {
    const selectedClient = this.client();

    if (!selectedClient) {
      return;
    }

    this.isSubmitting.set(true);

    this.clientsService.updateClient(selectedClient.id, request)
      .pipe(
        tap((updatedClient) => {
          this.notificationService.success(
            'Cliente aggiornato',
            'Le modifiche al cliente sono state salvate correttamente.'
          );

          this.router.navigate(['/clients', updatedClient.id]);
        }),
        catchError(() => {
          this.notificationService.error(
            'Modifica non riuscita',
            'Non è stato possibile aggiornare il cliente.'
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
    const selectedClient = this.client();

    if (selectedClient) {
      this.router.navigate(['/clients', selectedClient.id]);
      return;
    }

    this.router.navigateByUrl('/clients');
  }

  private loadClient(clientId: string): void {
    this.loaderService.show(MessagesLoader.loadingDetailClient);

    this.clientsService.getClientById(clientId)
      .pipe(
        tap((client) => {
          this.client.set(client);
        }),
        catchError(() => {
          this.notificationService.error(
            'Cliente non trovato',
            'Non è stato possibile recuperare il cliente da modificare.'
          );

          this.router.navigateByUrl('/clients');

          return EMPTY;
        }),
        finalize(() => {
          this.loaderService.hide();
        })
      )
      .subscribe();
  }
}