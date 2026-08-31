import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  Client,
  ClientInvoice,
  CreateClientRequest,
  UpdateClientRequest
} from '../models/client.model';

@Injectable({
  providedIn: 'root'
})
export class ClientsService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:8080/api/clients';

  getAllClients(): Observable<Client[]> {
    return this.http.get<Client[]>(this.apiUrl);
  }

  getClientById(clientId: string): Observable<Client> {
    const encodedClientId = encodeURIComponent(clientId);

    return this.http.get<Client>(`${this.apiUrl}/${encodedClientId}`);
  }

  getClientInvoices(clientId: string): Observable<ClientInvoice[]> {
    const encodedClientId = encodeURIComponent(clientId);

    return this.http.get<ClientInvoice[]>(`${this.apiUrl}/${encodedClientId}/invoices`);
  }

  createClient(request: CreateClientRequest): Observable<Client> {
    return this.http.post<Client>(this.apiUrl, request);
  }

  updateClient(clientId: string, request: UpdateClientRequest): Observable<Client> {
    const encodedClientId = encodeURIComponent(clientId);

    return this.http.put<Client>(`${this.apiUrl}/${encodedClientId}`, request);
  }

  deleteClient(clientId: string): Observable<void> {
    const encodedClientId = encodeURIComponent(clientId);

    return this.http.delete<void>(`${this.apiUrl}/${encodedClientId}`);
  }
}
