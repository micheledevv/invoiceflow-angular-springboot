import { Component, DestroyRef, computed, inject, input, output, signal } from '@angular/core';

import { Invoice } from '../../../features/invoices/models/invoice.model';
import { EuroCurrencyPipe } from '../../pipes/euro-currency.pipe';
import { ItalianDatePipe } from '../../pipes/italian-date.pipe';

type InvoiceStatus = 'paid' | 'pending' | 'draft';

type DueWarningType = 'overdue' | 'today' | 'tomorrow' | 'soon';

type DueWarning = {
  daysUntilDue: number;
  message: string;
  type: DueWarningType;
};

@Component({
  selector: 'app-invoice-records',
  imports: [EuroCurrencyPipe, ItalianDatePipe],
  templateUrl: './invoice-records.component.html',
  styleUrl: './invoice-records.component.scss'
})
export class InvoiceRecordsComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly millisecondsInADay = 1000 * 60 * 60 * 24;

  readonly invoices = input.required<Invoice[]>();

  readonly invoiceDetail = output<Invoice>();

  private readonly today = signal(new Date());

  protected readonly dueWarningsByInvoiceId = computed(() => {
    const warnings = new Map<string, DueWarning>();
    const today = this.today();

    for (const invoice of this.invoices()) {
      const warning = this.createDueWarning(invoice, today);

      if (warning) {
        warnings.set(invoice.id, warning);
      }
    }

    return warnings;
  });

  protected readonly statusLabels: Record<InvoiceStatus, string> = {
    paid: 'Pagata',
    pending: 'In attesa',
    draft: 'Bozza'
  };

  constructor() {
    const intervalId = window.setInterval(() => {
      this.today.set(new Date());
    }, 60 * 1000);

    this.destroyRef.onDestroy(() => {
      window.clearInterval(intervalId);
    });
  }

  protected getStatusLabel(status: string): string {
    return this.statusLabels[status as InvoiceStatus] ?? status;
  }

  protected getDueWarning(invoice: Invoice): DueWarning | null {
    return this.dueWarningsByInvoiceId().get(invoice.id) ?? null;
  }

  private createDueWarning(invoice: Invoice, today: Date): DueWarning | null {
    if (invoice.status !== 'pending') {
      return null;
    }

    const daysUntilDue = this.getDaysUntilDue(invoice.paymentDue, today);

    if (daysUntilDue === null) {
      return null;
    }

    if (daysUntilDue > 3) {
      return null;
    }

    return {
      daysUntilDue,
      message: this.getDueWarningMessage(daysUntilDue),
      type: this.getDueWarningType(daysUntilDue)
    };
  }

  private getDaysUntilDue(paymentDue: string, today: Date): number | null {
    if (!paymentDue) {
      return null;
    }

    const [year, month, day] = paymentDue.split('-').map(Number);

    if (!year || !month || !day) {
      return null;
    }

    const dueDateUtc = Date.UTC(year, month - 1, day);
    const todayUtc = Date.UTC(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    return Math.round((dueDateUtc - todayUtc) / this.millisecondsInADay);
  }

  private getDueWarningMessage(daysUntilDue: number): string {
    if (daysUntilDue < 0) {
      const overdueDays = Math.abs(daysUntilDue);

      return overdueDays === 1
        ? 'Attenzione, questa fattura è scaduta da 1 giorno.'
        : `Attenzione, questa fattura è scaduta da ${overdueDays} giorni.`;
    }

    if (daysUntilDue === 0) {
      return 'Attenzione, questa fattura scade oggi.';
    }

    if (daysUntilDue === 1) {
      return 'Attenzione, manca 1 giorno alla scadenza della fattura.';
    }

    return `Attenzione, mancano ${daysUntilDue} giorni alla scadenza della fattura.`;
  }

  private getDueWarningType(daysUntilDue: number): DueWarningType {
    if (daysUntilDue < 0) {
      return 'overdue';
    }

    if (daysUntilDue === 0) {
      return 'today';
    }

    if (daysUntilDue === 1) {
      return 'tomorrow';
    }

    return 'soon';
  }
}