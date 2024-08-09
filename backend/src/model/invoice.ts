import mongoose from "mongoose";
import {
  CustomerDetails,
  InvoiceData,
  InvoiceDetails,
  ProductDetails,
  TotalAmount,
} from "../types/types";

const AddressSchema = new mongoose.Schema({
  Street: { type: String },
  City: { type: String },
  State: { type: String },
  PostalCode: { type: String },
});

const CustomerDetailsSchema = new mongoose.Schema({
  Name: { type: String },
  BillingAddress: { type: AddressSchema },
  Phone: { type: String },
  Email: { type: String },
  ShippingAddress: { type: AddressSchema },
});

const IGSTSchema = new mongoose.Schema({
  Rate: { type: String },
  Amount: { type: Number },
});

const ProductDetailsSchema = new mongoose.Schema({
  Description: { type: String },
  HSN_SAC: { type: String },
  Rate: { type: Number },
  Quantity: { type: Number },
  Amount: { type: Number },
  IGST: { type: IGSTSchema },
  TotalAmount: { type: Number },
});

const TotalAmountSchema = new mongoose.Schema({
  TaxableAmount: { type: Number },
  IGST: { type: Number },
  RoundOff: { type: Number },
  TotalPayable: { type: Number },
  TCS: {
    Rate: { type: String },
    Amount: { type: Number },
  },
});

const InvoiceDetailsSchema = new mongoose.Schema({
  InvoiceNumber: { type: String },
  Date: { type: String },
  PlaceOfSupply: { type: String },
});

const InvoiceSchema = new mongoose.Schema({
  CustomerDetails: { type: CustomerDetailsSchema },
  InvoiceDetails: { type: InvoiceDetailsSchema },
  ProductDetails: { type: [ProductDetailsSchema] },
  TotalAmount: { type: TotalAmountSchema },
});

const Invoice = mongoose.model("Invoice", InvoiceSchema);

export default Invoice;

export async function createInvoiceReport(
  invoice: InvoiceData
): Promise<string> {
  try {
    const report = new Invoice(invoice);
    await report.save();
    return report._id.toString();
  } catch (error: Error | any) {
    console.log("Error while creating report: ", error.message);
    throw error;
  }
}

export async function getInvoiceReportById(
  id: string
): Promise<InvoiceData & { Id: string }> {
  try {
    const report = await Invoice.findById(id);

    return {
      Id: report?._id.toString() as string,
      CustomerDetails: report?.CustomerDetails as CustomerDetails,
      InvoiceDetails: report?.InvoiceDetails as InvoiceDetails,
      ProductDetails: report?.ProductDetails as ProductDetails[],
      TotalAmount: report?.TotalAmount as TotalAmount,
    };
  } catch (error: Error | any) {
    console.log("Error while getting report: ", error.message);
    throw error;
  }
}
