import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Client, CreateClientRequest } from '../models/client.model';

@Injectable({
  providedIn: 'root'
})
export class ClientsService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:8080/api/clients';

  createClient(request: CreateClientRequest) {
    return this.http.post<Client>(this.apiUrl, request);
  }
}