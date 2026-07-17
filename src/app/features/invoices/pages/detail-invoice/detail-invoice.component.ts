import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { EMPTY, catchError, filter, finalize, switchMap, take, tap } from 'rxjs';

import { ActionsButtonComponent } from '../../../../shared/components/actions-button/actions-button.component';
import { GenericModalService } from '../../../../shared/components/generic-modal/generic-modal.service';
import { LoaderService } from '../../../../shared/components/loader/loader.service';

import { InvoiceFormService } from '../../components/invoice-form/invoice-form.service';
import { DetailInvoiceService } from './detail-invoice.service';

import { Invoice, InvoiceStatus } from '../../models/invoice.model';
import { ItalianDatePipe } from '../../../../shared/pipes/italian-date.pipe';
import { EuroCurrencyPipe } from '../../../../shared/pipes/euro-currency.pipe';
import { NotificationService } from '../../../../shared/services/notification.service';

@Component({
  selector: 'app-detail-invoice',
  imports: [ActionsButtonComponent, ItalianDatePipe, EuroCurrencyPipe],
  templateUrl: './detail-invoice.component.html',
  styleUrl: './detail-invoice.component.scss'
})
export class DetailInvoiceComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  private readonly invoiceFormService = inject(InvoiceFormService);
  private readonly detailInvoiceService = inject(DetailInvoiceService);
  private readonly modalService = inject(GenericModalService);
  private readonly loaderService = inject(LoaderService);
  private readonly notificationService = inject(NotificationService);

  protected readonly invoice = signal<Invoice | null>(null);

  private readonly statusLabels: Record<InvoiceStatus, string> = {
    paid: 'Pagata',
    pending: 'In attesa',
    draft: 'Bozza'
  };

  ngOnInit(): void {
    this.getInvoice();

    this.detailInvoiceService.updateSingleInvoice
      .pipe(
        tap(() => {
          this.getInvoice();
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  protected editInvoice(): void {
    const currentInvoice = this.invoice();

    if (!currentInvoice) {
      return;
    }

    this.invoiceFormService.setEditMode();
    this.detailInvoiceService.takeInvoice(currentInvoice);
    this.invoiceFormService.openForm();
  }

  protected deleteInvoice(): void {
    const currentInvoice = this.invoice();

    if (!currentInvoice) {
      return;
    }

    this.modalService.openModal(
      'Conferma eliminazione',
      `Sei sicuro di voler eliminare la fattura #${currentInvoice.id}? Questa azione sarà irreversibile.`
    );

    this.modalService.confirmResult$
      .pipe(
        take(1),
        filter(Boolean),
        switchMap(() => {
          this.loaderService.show();

          return this.detailInvoiceService.deleteInvoice(currentInvoice.id)
            .pipe(
              tap(() => {
                this.notificationService.success(
                  'Fattura eliminata',
                  `La fattura #${currentInvoice.id} è stata eliminata correttamente.`
                );

                this.router.navigate(['']);
              }),
              catchError(() => {
                this.notificationService.error(
                  'Eliminazione non riuscita',
                  `Non è stato possibile eliminare la fattura #${currentInvoice.id}.`
                );

                return EMPTY;
              }),
              finalize(() => {
                this.loaderService.hide();
              })
            );
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }

  protected markAsPaidInvoice(): void {
    const currentInvoice = this.invoice();

    if (!currentInvoice) {
      return;
    }

    this.loaderService.show();

    this.detailInvoiceService.markAsPaid(currentInvoice.id)
      .pipe(
        tap((updatedInvoice) => {
          this.invoice.set(updatedInvoice);
          this.detailInvoiceService.takeInvoice(updatedInvoice);

          this.notificationService.success(
            'Fattura pagata',
            `La fattura #${updatedInvoice.id} è stata segnata come pagata.`
          );
        }),
        catchError(() => {
          this.notificationService.error(
            'Pagamento non riuscito',
            `Non è stato possibile segnare come pagata la fattura #${currentInvoice.id}.`
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

  protected goBack(): void {
    this.router.navigate(['']);
  }

  protected getStatusLabel(status: InvoiceStatus): string {
    return this.statusLabels[status] ?? status;
  }

  private getInvoice(): void {
    const invoiceId = this.route.snapshot.paramMap.get('id');

    if (!invoiceId) {
      this.router.navigate(['']);
      return;
    }

    this.loaderService.show();

    this.detailInvoiceService.getInvoice(invoiceId)
      .pipe(
        tap((singleInvoice) => {
          this.invoice.set(singleInvoice);
          this.detailInvoiceService.takeInvoice(singleInvoice);
        }),
        catchError(() => {
          this.notificationService.error(
            'Fattura non trovata',
            'Non è stato possibile recuperare il dettaglio della fattura.'
          );

          this.router.navigate(['']);

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