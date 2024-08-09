import { Ocr } from "node-ts-ocr";
import {
  GoogleGenerativeAI,
  FunctionDeclarationSchemaType,
  FunctionDeclarationSchemaProperty,
} from "@google/generative-ai";

import getEnv from "../envConfig";
import { InvoiceData } from "../types/types";

const env = getEnv();

const GEMINI_API_KEY = env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const OUTPUT_SCHEMA: FunctionDeclarationSchemaProperty | any = {
  type: FunctionDeclarationSchemaType.OBJECT,
  description:
    "Schema for extracting invoice information, including customer details, products, and total amount.",
  properties: {
    CustomerDetails: {
      type: FunctionDeclarationSchemaType.OBJECT,
      description:
        "Details about the customer, including name, billing, and shipping addresses.",
      properties: {
        Name: {
          type: FunctionDeclarationSchemaType.STRING,
          description: "The full name of the customer.",
        },
        BillingAddress: {
          type: FunctionDeclarationSchemaType.OBJECT,
          description: "The billing address for the customer.",
          properties: {
            Street: {
              type: FunctionDeclarationSchemaType.STRING,
              description: "Street address for billing.",
            },
            City: {
              type: FunctionDeclarationSchemaType.STRING,
              description: "City for billing.",
            },
            State: {
              type: FunctionDeclarationSchemaType.STRING,
              description: "State for billing.",
            },
            PostalCode: {
              type: FunctionDeclarationSchemaType.STRING,
              description: "Postal code for billing.",
            },
          },
        },
        Phone: {
          type: FunctionDeclarationSchemaType.STRING,
          description: "Customer's phone number.",
        },
        Email: {
          type: FunctionDeclarationSchemaType.STRING,
          description: "Customer's email address.",
        },
        ShippingAddress: {
          type: FunctionDeclarationSchemaType.OBJECT,
          description: "The shipping address for the customer.",
          properties: {
            Street: {
              type: FunctionDeclarationSchemaType.STRING,
              description: "Street address for shipping.",
            },
            City: {
              type: FunctionDeclarationSchemaType.STRING,
              description: "City for shipping.",
            },
            State: {
              type: FunctionDeclarationSchemaType.STRING,
              description: "State for shipping.",
            },
            PostalCode: {
              type: FunctionDeclarationSchemaType.STRING,
              description: "Postal code for shipping.",
            },
          },
        },
      },
    },
    InvoiceDetails: {
      type: FunctionDeclarationSchemaType.OBJECT,
      description:
        "Details about the invoice, such as the invoice number and date.",
      properties: {
        InvoiceNumber: {
          type: FunctionDeclarationSchemaType.STRING,
          description: "Unique identifier for the invoice.",
        },
        Date: {
          type: FunctionDeclarationSchemaType.STRING,
          description: "Date of the invoice, formatted as 'DD MMM YYYY'.",
        },
        PlaceOfSupply: {
          type: FunctionDeclarationSchemaType.STRING,
          description: "The place of supply, such as state code or name.",
        },
      },
    },
    ProductDetails: {
      type: FunctionDeclarationSchemaType.ARRAY,
      description:
        "Details about the products or services listed on the invoice.",
      items: {
        type: FunctionDeclarationSchemaType.OBJECT,
        properties: {
          Description: {
            type: FunctionDeclarationSchemaType.STRING,
            description: "Description of the product or service.",
          },
          HSN_SAC: {
            type: FunctionDeclarationSchemaType.STRING,
            description: "HSN or SAC code of the product or service.",
          },
          Rate: {
            type: FunctionDeclarationSchemaType.NUMBER,
            description: "Rate per unit of the product or service.",
          },
          Quantity: {
            type: FunctionDeclarationSchemaType.NUMBER,
            description: "Quantity of the product or service.",
          },
          Amount: {
            type: FunctionDeclarationSchemaType.NUMBER,
            description: "Total amount for the product or service.",
          },
          IGST: {
            type: FunctionDeclarationSchemaType.OBJECT,
            description: "Integrated Goods and Services Tax (IGST) details.",
            properties: {
              Rate: {
                type: FunctionDeclarationSchemaType.STRING,
                description: "IGST rate, e.g., '18%'.",
              },
              Amount: {
                type: FunctionDeclarationSchemaType.NUMBER,
                description: "Total IGST amount.",
              },
            },
          },
          TotalAmount: {
            type: FunctionDeclarationSchemaType.NUMBER,
            description:
              "Total amount for the product or service, including tax.",
          },
        },
      },
    },
    TotalAmount: {
      type: FunctionDeclarationSchemaType.OBJECT,
      description:
        "Overall totals for the invoice, including taxable amounts and total payable.",
      properties: {
        TaxableAmount: {
          type: FunctionDeclarationSchemaType.NUMBER,
          description: "Total taxable amount for the invoice.",
        },
        IGST: {
          type: FunctionDeclarationSchemaType.NUMBER,
          description: "Total IGST amount for the invoice.",
        },
        RoundOff: {
          type: FunctionDeclarationSchemaType.NUMBER,
          description: "Any rounding off value applied to the total amount.",
        },
        TotalPayable: {
          type: FunctionDeclarationSchemaType.NUMBER,
          description: "Total amount payable for the invoice.",
        },
        TCS: {
          type: FunctionDeclarationSchemaType.OBJECT,
          description: "Tax Collected at Source (TCS) details.",
          properties: {
            Rate: {
              type: FunctionDeclarationSchemaType.STRING,
              description: "TCS rate, e.g., '1%'.",
            },
            Amount: {
              type: FunctionDeclarationSchemaType.NUMBER,
              description: "Total TCS amount.",
            },
          },
        },
      },
    },
  },
};

export default async function extractInfo(
  input_path: string
): Promise<InvoiceData> {
  try {
    const text = await Ocr.extractText(input_path);

    console.log(text);

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: OUTPUT_SCHEMA,
      },
    });

    const prompt = `
        Role: You are a working professional who extracts data from invoice pdfs.
        Task: Extract relevant details like:
                - Customer details
                - Products
                - Amount details and total amount
        Input: OCR text of invoice: ${text}
        OutputFormat: JSON
    `;

    const result = await model.generateContent(prompt);
    const jsonResponse = JSON.parse(result.response.text()); // Extract the JSON directly

    console.log(jsonResponse);

    return jsonResponse;
  } catch (error: Error | any) {
    console.log(error.message);
    throw error;
  }
}
