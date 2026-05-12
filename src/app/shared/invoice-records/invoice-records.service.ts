import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Invoice } from '../../models/invoice.model';

@Injectable({
  providedIn: 'root'
})
export class InvoiceRecordsService {

  constructor() { }

  sendItem = new BehaviorSubject<Invoice[]>([]);
  sendItem$ = this.sendItem.asObservable();

  sendItemm(item:any){
    this.sendItem.next(item)
  }
}
