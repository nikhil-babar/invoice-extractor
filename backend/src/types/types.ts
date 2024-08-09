export interface CustomerDetails {
  BillingAddress: Address;
  Email: string;
  Name: string;
  Phone: string;
  ShippingAddress: Address;
}

export interface Address {
  City: string;
  PostalCode: string;
  State: string;
  Street: string;
}

export interface InvoiceDetails {
  Date: string;
  InvoiceNumber: string;
  PlaceOfSupply: string;
}

export interface ProductDetails {
  Amount: number;
  Description: string;
  HSN_SAC: string;
  IGST: Tax;
  Quantity: number;
  Rate: number;
  TotalAmount: number;
}

export interface Tax {
  Amount: number;
  Rate: string;
}

export interface TotalAmount {
  IGST: number;
  RoundOff: number;
  TCS: Tax;
  TaxableAmount: number;
  TotalPayable: number;
}

export interface InvoiceData {
  CustomerDetails: CustomerDetails;
  InvoiceDetails: InvoiceDetails;
  ProductDetails: ProductDetails[];
  TotalAmount: TotalAmount;
}
