import { Component, inject, OnInit } from '@angular/core';
import { InvoiceRecordsService } from '../../shared/invoice-records/invoice-records.service';
import { filter, switchMap, take, tap } from 'rxjs';
import { NgClass } from '@angular/common';
import { Router } from '@angular/router';
import { InvoiceFormService } from '../invoice-form/invoice-form.service';
import { ActionsButtonComponent } from '../../shared/components/actions-button/actions-button.component';
import { DetailInvoiceService } from './detail-invoice.service';
import { GenericModalService } from '../../shared/components/generic-modal/generic-modal.service';

@Component({
  selector: 'app-detail-invoice',
  imports: [NgClass, ActionsButtonComponent],
  templateUrl: './detail-invoice.component.html',
  styleUrl: './detail-invoice.component.scss'
})
export class DetailInvoiceComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly invoiceFormService = inject(InvoiceFormService);
  private readonly detailInvoiceService = inject(DetailInvoiceService);
  private readonly itemService = inject(InvoiceRecordsService);
  private readonly modalService = inject(GenericModalService);

  invoice: any = {};

  ngOnInit(): void {
    this.itemService.sendItem$.pipe(
      tap((item) => {
        this.invoice = item;
      })
    ).subscribe();
  }

  protected goBack(): void {
    this.router.navigate(['']);
  }

  editInvoice(): void {
    this.invoiceFormService.setEditMode();
    this.detailInvoiceService.takeInvoice(this.invoice);
    this.invoiceFormService.openForm();
  }

  deleteInvoice(): void {
    this.modalService.openModal(
      'Conferma Eliminazione',
      `Sei sicuro di voler eliminare la Fattura #${this.invoice.id}? Questa azione sarà irreversibile.`
    );

    this.modalService.confirmResult$.pipe(
      take(1),
      filter((confirmed) => confirmed)
    ).subscribe(() => {
      console.log('Elimino davvero la fattura con id:', this.invoice.id);

      // Qui poi farai la chiamata HTTP vera:
      // this.detailInvoiceService.deleteInvoice(this.invoice.id).subscribe(...)
    });
  }
}