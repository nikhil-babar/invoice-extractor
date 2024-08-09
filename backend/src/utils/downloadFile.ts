import { writeFile } from "fs/promises";
import request from "request-promise-native";

export default async function downloadPDF(url: string, outputPath: string) {
  let pdfBuffer = await request.get({ uri: url, encoding: null });
  console.log("Writing downloaded PDF file to " + outputPath + "...");
  await writeFile(outputPath, pdfBuffer);
}
