import { Component, inject, OnInit } from '@angular/core';
import { filter, finalize, take, tap } from 'rxjs';
import { NgClass } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { InvoiceFormService } from '../invoice-form/invoice-form.service';
import { ActionsButtonComponent } from '../../shared/components/actions-button/actions-button.component';
import { DetailInvoiceService } from './detail-invoice.service';
import { GenericModalService } from '../../shared/components/generic-modal/generic-modal.service';
import { Invoice } from '../../models/invoice.model';
import { LoaderService } from '../../shared/components/loader/loader.service';

@Component({
  selector: 'app-detail-invoice',
  imports: [NgClass, ActionsButtonComponent],
  templateUrl: './detail-invoice.component.html',
  styleUrl: './detail-invoice.component.scss'
})
export class DetailInvoiceComponent implements OnInit {

  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly invoiceFormService = inject(InvoiceFormService);
  private readonly detailInvoiceService = inject(DetailInvoiceService);
  private readonly modalService = inject(GenericModalService);
  private readonly loaderService = inject(LoaderService)

  invoice: any = {};

  ngOnInit(): void {
    this.getInvoice();
 
  }

   protected editInvoice(): void {
    this.invoiceFormService.setEditMode();
    this.detailInvoiceService.takeInvoice(this.invoice);
    this.invoiceFormService.openForm();
  }

  protected deleteInvoice(): void {
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

  saveAsDraftInvoice() {
    throw new Error('Method not implemented.');
  }

  protected goBack(): void {
    this.router.navigate(['']);
  }

  private getInvoice(){
    this.loaderService.show()

    const invoiceId = this.route.snapshot.paramMap.get('id');
    
    this.detailInvoiceService.getInvoice(invoiceId).pipe(
      tap((singleInvoice:Invoice) => {
        console.log(singleInvoice)
        this.invoice = singleInvoice
      }),
      finalize(()=>{
        this.loaderService.hide()
      })
    ).subscribe()
  }
}