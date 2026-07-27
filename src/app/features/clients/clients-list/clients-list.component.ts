import { Component, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { inject } from '@angular/core';

import { EuroCurrencyPipe } from '../../../shared/pipes/euro-currency.pipe';

type ClientAddress = {
  street: string;
  city: string;
  postCode: string;
  country: string;
};

export type Client = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  vatNumber?: string;
  taxCode?: string;
  address: ClientAddress;
  invoicesCount?: number;
  totalBilled?: number;
  notes?: string;
  createdAt: string;
};

@Component({
  selector: 'app-clients-list',
  imports: [EuroCurrencyPipe],
  templateUrl: './clients-list.component.html',
  styleUrl: './clients-list.component.scss'
})
export class ClientsListComponent {
  private readonly router = inject(Router);

  protected readonly searchTerm = signal('');

  protected readonly clients = signal<Client[]>([
    {
      id: 'CL-0001',
      name: 'Mario Rossi',
      email: 'mario.rossi@test.it',
      phone: '+39 333 123 4567',
      vatNumber: 'IT12345678901',
      address: {
        street: 'Via Roma, 24',
        city: 'Milano',
        postCode: '20121',
        country: 'Italia'
      },
      invoicesCount: 4,
      totalBilled: 2840.50,
      notes: 'Cliente storico con pagamenti regolari.',
      createdAt: '2026-07-27'
    },
    {
      id: 'CL-0002',
      name: 'Studio Design Lab',
      email: 'info@designlab.it',
      phone: '+39 091 555 8899',
      vatNumber: 'IT98765432109',
      address: {
        street: 'Corso Vittorio Emanuele, 112',
        city: 'Palermo',
        postCode: '90133',
        country: 'Italia'
      },
      invoicesCount: 2,
      totalBilled: 1750,
      notes: 'Richiede spesso lavori grafici e sviluppo landing page.',
      createdAt: '2026-07-27'
    },
    {
      id: 'CL-0003',
      name: 'Tech Solutions SRL',
      email: 'amministrazione@techsolutions.it',
      phone: '+39 02 4567 8901',
      vatNumber: 'IT11223344556',
      address: {
        street: 'Via Torino, 8',
        city: 'Torino',
        postCode: '10121',
        country: 'Italia'
      },
      invoicesCount: 7,
      totalBilled: 9450.75,
      notes: 'Cliente aziendale con più fatture attive.',
      createdAt: '2026-07-27'
    },
    {
      id: 'CL-0004',
      name: 'Giulia Bianchi',
      email: 'giulia.bianchi@test.it',
      phone: '',
      taxCode: 'BNCGLI96A41H501Z',
      address: {
        street: 'Via Napoli, 15',
        city: 'Catania',
        postCode: '95131',
        country: 'Italia'
      },
      invoicesCount: 0,
      totalBilled: 0,
      notes: '',
      createdAt: '2026-07-27'
    }
  ]);

  protected readonly filteredClients = computed(() => {
    const searchValue = this.searchTerm().trim().toLowerCase();

    if (!searchValue) {
      return this.clients();
    }

    return this.clients().filter((client) => {
      const searchableText = [
        client.name,
        client.email,
        client.phone,
        client.vatNumber,
        client.taxCode,
        client.address.street,
        client.address.city,
        client.address.postCode,
        client.address.country
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return searchableText.includes(searchValue);
    });
  });

  protected onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;

    this.searchTerm.set(input.value);
  }

  protected openCreateClientForm(): void {
    this.router.navigateByUrl('/clients/new');
  }

  protected openClientDetail(client: Client): void {
    this.router.navigate(['/clients', client.id]);
  }

  protected goBack(): void {
    this.router.navigate(['']);
  }
}