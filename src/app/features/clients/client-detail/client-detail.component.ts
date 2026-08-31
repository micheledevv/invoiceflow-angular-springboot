import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, EMPTY, filter, finalize, forkJoin, switchMap, take, tap } from 'rxjs';

import { Client, ClientInvoice } from '../models/client.model';
import { ClientsService } from '../services/clients.service';
import { EuroCurrencyPipe } from '../../../shared/pipes/euro-currency.pipe';
import { ItalianDatePipe } from '../../../shared/pipes/italian-date.pipe';
import { LoaderService } from '../../../shared/components/loader/loader.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { GenericModalService } from '../../../shared/components/generic-modal/generic-modal.service';
import { InvoiceFormService } from '../../invoices/components/invoice-form/invoice-form.service';

type InvoiceStatus = 'paid' | 'pending' | 'draft';

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
  private readonly modalService = inject(GenericModalService);
  private readonly invoiceFormService = inject(InvoiceFormService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly client = signal<Client | null>(null);
  protected readonly clientInvoices = signal<ClientInvoice[]>([]);
  protected readonly isDeleting = signal(false);

  protected readonly statusLabels: Record<InvoiceStatus, string> = {
    paid: 'Pagata',
    pending: 'In attesa',
    draft: 'Bozza'
  };

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

    this.loadClientDetail(clientId);

    this.invoiceFormService.updateGetInvoices
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.loadClientDetail(clientId));
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

  protected createInvoice(): void {
    const selectedClient = this.client();

    if (!selectedClient) {
      return;
    }

    this.invoiceFormService.setCreateMode(selectedClient.id);
    this.invoiceFormService.openForm();
  }

  protected deleteClient(): void {
    const selectedClient = this.client();

    if (!selectedClient || this.isDeleting()) {
      return;
    }

    this.modalService.openModal(
      'Elimina cliente',
      `Vuoi davvero eliminare il cliente "${selectedClient.name}"? Le fatture già create resteranno salvate.`
    );

    this.modalService.confirmResult$
      .pipe(
        take(1),
        filter((confirmed) => confirmed),
        switchMap(() => {
          this.isDeleting.set(true);
          this.loaderService.show('Eliminazione cliente...');

          return this.clientsService.deleteClient(selectedClient.id)
            .pipe(
              tap(() => {
                this.notificationService.success(
                  'Cliente eliminato',
                  'Il cliente è stato eliminato correttamente.'
                );

                this.router.navigateByUrl('/clients');
              }),
              catchError(() => {
                this.notificationService.error(
                  'Eliminazione non riuscita',
                  'Non è stato possibile eliminare il cliente.'
                );

                return EMPTY;
              }),
              finalize(() => {
                this.isDeleting.set(false);
                this.loaderService.hide();
              })
            );
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  protected openInvoice(invoice: ClientInvoice): void {
    this.router.navigate(['/detail-invoice', invoice.id]);
  }

  protected getStatusLabel(status: string): string {
    return this.statusLabels[status as InvoiceStatus] ?? status;
  }

  private loadClientDetail(clientId: string): void {
    this.loaderService.show('Caricamento cliente...');

    forkJoin({
      client: this.clientsService.getClientById(clientId),
      invoices: this.clientsService.getClientInvoices(clientId)
    })
      .pipe(
        tap(({ client, invoices }) => {
          this.client.set(client);
          this.clientInvoices.set(invoices);
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
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }
}
