export interface InvoiceItemFormModel {
  name: string;
  quantity: string;
  price: string;
}

export interface InvoiceFormModel {
  senderAddress: {
    street: string;
    city: string;
    postCode: string;
    country: string;
  };

  clientName: string;
  clientEmail: string;

  clientAddress: {
    street: string;
    city: string;
    postCode: string;
    country: string;
  };

  createdAt: string;
  paymentTerms: string;
  description: string;

  items: InvoiceItemFormModel[];
}