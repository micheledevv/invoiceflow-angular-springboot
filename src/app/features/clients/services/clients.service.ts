import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Client, CreateClientRequest } from '../models/client.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientsService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:8080/api/clients';

  createClient(request: CreateClientRequest):Observable<Client> {
    return this.http.post<Client>(this.apiUrl, request);
  }

  getAllClients():Observable<Client[]>{
    return this.http.get<Client[]>(this.apiUrl)
  }
}