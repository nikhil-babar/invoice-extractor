import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { v4 } from "uuid";
import path from "path";
import downloadPDF from "../utils/downloadFile";
import extractInfo from "../utils/extractInfo";
import { createInvoiceReport, getInvoiceReportById } from "../model/invoice";

const ExtractInvoiceParamsSchema = Joi.object({
  pdf_url: Joi.string(),
}).strict();

const GetInvoiceParamsScheam = Joi.object({
  id: Joi.string(),
}).strict();

export async function extractInvoice(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const params = ExtractInvoiceParamsSchema.validate(req.body);

    if (params.error) {
      return res.sendStatus(422);
    }

    const process_id = v4().split("-").join("");

    const outPath = path.join(process.cwd(), "output", process_id + ".pdf");

    await downloadPDF(params.value.pdf_url as string, outPath);

    const text = await extractInfo(`output/${process_id}.pdf`);

    const invoice_id = await createInvoiceReport(text);

    return res.status(200).json({
      data: text,
      invoice_id,
    });
  } catch (error: Error | any) {
    console.log(error.message);
    return res.sendStatus(500);
  }
}

export async function getInvoice(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const params = GetInvoiceParamsScheam.validate(req.query);

    if (params.error) {
      return res.sendStatus(422);
    }

    const invoice = await getInvoiceReportById(params.value.id);

    return res.status(200).json({
      data: invoice,
    });
  } catch (error: Error | any) {
    console.log(error.message);
    return res.sendStatus(500);
  }
}
