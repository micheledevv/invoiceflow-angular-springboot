import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

import { EuroCurrencyPipe } from '../../../shared/pipes/euro-currency.pipe';
import { ClientsService } from '../services/clients.service';
import { catchError, EMPTY, finalize, tap } from 'rxjs';
import { NotificationService } from '../../../shared/services/notification.service';
import { LoaderService } from '../../../shared/components/loader/loader.service';
import { MessagesLoader } from '../../../shared/components/loader/models/text.messages.model';
import { Client } from '../models/client.model';

@Component({
  selector: 'app-clients-list',
  imports: [EuroCurrencyPipe],
  templateUrl: './clients-list.component.html',
  styleUrl: './clients-list.component.scss'
})
export class ClientsListComponent implements OnInit {
  private readonly clientsService = inject(ClientsService);
  private readonly notificationService = inject(NotificationService);
  private readonly loaderService = inject(LoaderService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.loadClients();
  }

  private loadClients(): void {
    this.loaderService.show(MessagesLoader.loadingClients);

    this.clientsService.getAllClients()
      .pipe(
        tap((clients) => {
          this.clients.set(clients);
        }),
        catchError(() => {
          this.notificationService.error(
            'Clienti non recuperati',
            'Non è stato possibile recuperare i clienti.'
          );

          return EMPTY;
        }),
        finalize(() => {
          this.loaderService.hide();
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  protected readonly searchTerm = signal('');

  protected readonly clients = signal<Client[]>([]);

  protected readonly filteredClients = computed(() => {
    const searchValue = this.searchTerm().trim().toLowerCase();

    if (!searchValue) {
      return this.clients();
    }

    return this.clients().filter((client) => {
      const searchableText = [
        client.name,
        client.email,
        client.phone,
        client.vatNumber,
        client.taxCode,
        client.address.street,
        client.address.city,
        client.address.postCode,
        client.address.country
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return searchableText.includes(searchValue);
    });
  });

  protected onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;

    this.searchTerm.set(input.value);
  }

  protected openCreateClientForm(): void {
    this.router.navigateByUrl('/clients/new');
  }

  protected openClientDetail(client: Client): void {
    this.router.navigate(['/clients', client.id]);
  }

  protected goBack(): void {
    this.router.navigate(['']);
  }
}
