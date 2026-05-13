export interface AddressFormModel {
  street: string;
  city: string;
  postCode: string;
  country: string;
}

export interface InvoiceFormModel {
  senderAddress: AddressFormModel;
  clientName: string;
  clientEmail: string;
  clientAddress: AddressFormModel;
  createdAt: string;
  paymentTerms: string;
  description: string;
}