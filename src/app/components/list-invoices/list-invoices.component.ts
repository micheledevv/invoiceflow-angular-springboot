import { Component, OnInit } from '@angular/core';
import { InvoiceRecordsComponent } from '../../shared/invoice-records/invoice-records.component';
import { ListInvoicesService } from './list-invoices.service';
import { tap } from 'rxjs';
import { Invoice } from '../../models/invoice.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-invoices',
  imports: [InvoiceRecordsComponent],
  templateUrl: './list-invoices.component.html',
  styleUrl: './list-invoices.component.scss'
})
export class ListInvoicesComponent implements OnInit {
  constructor(private listInvoicesService: ListInvoicesService, private router: Router){

  }
  allInvoices:Invoice[] = [];

  ngOnInit(): void {
    this.listInvoicesService.getInvoices().pipe(
      tap((invoices) => {
        console.log(invoices)
        this.allInvoices = invoices
      })
      
    ).subscribe()
  }

  goToDetail(invoice: Invoice): void {
    this.router.navigate(['/detail-invoice', invoice.id]);
  }

}
