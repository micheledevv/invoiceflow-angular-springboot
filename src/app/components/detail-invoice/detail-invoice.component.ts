import { Component, OnInit } from '@angular/core';
import { InvoiceRecordsService } from '../../shared/invoice-records/invoice-records.service';
import { tap } from 'rxjs';
import { NgClass } from '@angular/common';
import { Router } from '@angular/router';
import { InvoiceFormService } from '../invoice-form/invoice-form.service';
import { ActionsButtonComponent } from '../../shared/components/actions-button/actions-button.component';
import { DetailInvoiceService } from './detail-invoice.service';

@Component({
  selector: 'app-detail-invoice',
  imports: [NgClass, ActionsButtonComponent],
  templateUrl: './detail-invoice.component.html',
  styleUrl: './detail-invoice.component.scss'
})
export class DetailInvoiceComponent implements OnInit {
  constructor(private itemService: InvoiceRecordsService,
     private router: Router, 
     private invoiceFormService:InvoiceFormService, 
     private detailInvoiceService: DetailInvoiceService){}

  invoice:any = {}
  ngOnInit(): void {
    this.itemService.sendItem$.pipe(
      tap((item) => {
        console.log(item)
        this.invoice = item

      })

    ).subscribe()
    
  }

  protected goBack(){
    this.router.navigate([''])
  }


editInvoice(): void {
  this.invoiceFormService.setEditMode();
  this.detailInvoiceService.takeInvoice(this.invoice);
  this.invoiceFormService.openForm();

  console.log('edit');
}

}
