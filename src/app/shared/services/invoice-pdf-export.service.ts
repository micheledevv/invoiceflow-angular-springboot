import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InvoicePdfExportService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:8080/api/invoices';

  exportInvoicePdf(invoiceId: string) {
    const encodedInvoiceId = encodeURIComponent(invoiceId);

    return this.http
      .get(`${this.apiUrl}/${encodedInvoiceId}/pdf`, {
        responseType: 'blob'
      })
      .pipe(
        tap((pdfBlob) => {
          this.downloadBlob(pdfBlob, `invoice-${invoiceId}.pdf`);
        }),
        map(() => void 0)
      );
  }

  private downloadBlob(blob: Blob, fileName: string): void {
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = objectUrl;
    link.download = fileName;
    link.click();

    URL.revokeObjectURL(objectUrl);
  }
}