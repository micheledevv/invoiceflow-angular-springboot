import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, EMPTY, finalize, tap } from 'rxjs';

import { Client } from '../models/client.model';
import { ClientsService } from '../services/clients.service';
import { EuroCurrencyPipe } from '../../../shared/pipes/euro-currency.pipe';
import { ItalianDatePipe } from '../../../shared/pipes/italian-date.pipe';
import { LoaderService } from '../../../shared/components/loader/loader.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { MessagesLoader } from '../../../shared/components/loader/models/text.messages.model';

@Component({
  selector: 'app-client-detail',
  imports: [EuroCurrencyPipe, ItalianDatePipe],
  templateUrl: './client-detail.component.html',
  styleUrl: './client-detail.component.scss'
})
export class ClientDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly clientsService = inject(ClientsService);
  private readonly loaderService = inject(LoaderService);
  private readonly notificationService = inject(NotificationService);

  protected readonly client = signal<Client | null>(null);

  ngOnInit(): void {
    const clientId = this.route.snapshot.paramMap.get('id');

    if (!clientId) {
      this.notificationService.error(
        'Cliente non valido',
        'Non è stato possibile recuperare il cliente richiesto.'
      );

      this.router.navigateByUrl('/clients');
      return;
    }

    this.loadClient(clientId);
  }

  protected goBack(): void {
    this.router.navigateByUrl('/clients');
  }

  protected editClient(): void {
    const selectedClient = this.client();

    if (!selectedClient) {
      return;
    }

    this.router.navigate(['/clients', selectedClient.id, 'edit']);
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
            'Non è stato possibile recuperare il dettaglio del cliente.'
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