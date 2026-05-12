import { Component, OnInit } from '@angular/core';
import { InvoiceRecordsService } from '../../shared/invoice-records/invoice-records.service';
import { tap } from 'rxjs';
import { Invoice } from '../../models/invoice.model';
import { NgClass } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-detail-invoice',
  imports: [NgClass],
  templateUrl: './detail-invoice.component.html',
  styleUrl: './detail-invoice.component.scss'
})
export class DetailInvoiceComponent implements OnInit {
  constructor(private itemService: InvoiceRecordsService, private router: Router){}
  invoice:any = {}
  ngOnInit(): void {
    this.itemService.sendItem$.pipe(
      tap((item) => {
        console.log(item)
        this.invoice = item

      })

    ).subscribe()
    
  }

  goBack(){
    this.router.navigate([''])
  }

}
