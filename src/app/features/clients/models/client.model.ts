export type ClientAddress = {
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

export type ClientFormValue = {
  name: string;
  email: string;
  phone: string;
  vatNumber: string;
  taxCode: string;
  address: ClientAddress;
  notes: string;
};

export type CreateClientRequest = ClientFormValue;