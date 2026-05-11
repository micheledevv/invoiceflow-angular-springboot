import { Component, Input } from '@angular/core';
import { Invoice } from '../../models/invoice.model';

@Component({
  selector: 'app-invoice-records',
  imports: [],
  templateUrl: './invoice-records.component.html',
  styleUrl: './invoice-records.component.scss'
})
export class InvoiceRecordsComponent {
  @Input() invoices:Invoice[] = []

}
