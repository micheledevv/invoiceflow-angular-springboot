import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ListInvoicesService {

  constructor(
    private http:HttpClient
  ) { }

  getInvoices():Observable<any>{
    const url = 'assets/data/data.json'
    return this.http.get(url)

  }
}
