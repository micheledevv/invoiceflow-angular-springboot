import { Component, inject, input, signal } from '@angular/core';
import { catchError, EMPTY, finalize, tap } from 'rxjs';

import { NotificationService } from '../../../../shared/services/notification.service';
import { InvoicePdfExportService } from '../../../../shared/services/invoice-pdf-export.service';

@Component({
  selector: 'app-invoice-pdf-download-button',
  imports: [],
  templateUrl: './invoice-pdf-download-button.component.html',
  styleUrl: './invoice-pdf-download-button.component.scss'
})
export class InvoicePdfDownloadButtonComponent {
  private readonly invoicePdfExportService = inject(InvoicePdfExportService);
  private readonly notificationService = inject(NotificationService);

  readonly invoiceId = input.required<string>();

  protected readonly isDownloading = signal(false);

  protected downloadPdf(): void {
    if (this.isDownloading()) {
      return;
    }

    this.isDownloading.set(true);

    this.invoicePdfExportService.exportInvoicePdf(this.invoiceId())
      .pipe(
        tap(() => {
          this.notificationService.success(
            'PDF scaricato',
            'La copia PDF della fattura è stata scaricata.'
          );
        }),
        catchError(() => {
          this.notificationService.error(
            'Download non riuscito',
            'Non è stato possibile scaricare il PDF della fattura.'
          );

          return EMPTY;
        }),
        finalize(() => {
          this.isDownloading.set(false);
        })
      )
      .subscribe();
  }
}