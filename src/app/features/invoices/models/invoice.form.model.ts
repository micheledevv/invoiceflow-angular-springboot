export type InvoiceFormModel = {
  clientId: string;
  senderName: string;

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

  items: {
    name: string;
    quantity: string;
    price: string;
  }[];
};
