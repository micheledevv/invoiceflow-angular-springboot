import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Invoice } from '../../models/invoice.model';
import { InvoiceRecordsService } from './invoice-records.service';

@Component({
  selector: 'app-invoice-records',
  imports: [],
  templateUrl: './invoice-records.component.html',
  styleUrl: './invoice-records.component.scss'
})
export class InvoiceRecordsComponent {
  constructor(){}
  @Input() invoices:Invoice[] = []
  @Output() invoiceDetail = new EventEmitter<any>();

  detailInvoice(invoice:Invoice){
    this.invoiceDetail.emit(invoice)

  }

}
