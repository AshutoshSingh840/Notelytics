import fs from "fs/promises";
import { PDFParse } from "pdf-parse"; // 🔴 ERROR HERE (pdf-parse does not export PDFParse like this)

/**
 * Extract text from PDF file
 * @param {string} filePath - Path to PDF file
 * @returns {Promise<{text: string, numPages: number}>}
 */
export const extractTextFromPDF = async (filePath) => {
  try {
    const dataBuffer = await fs.readFile(filePath);
    // pdf-parse expects a Uint8Array, not a Buffer
    const parser = new PDFParse(new Uint8Array(dataBuffer)); // 🔴 ERROR HERE (Incorrect usage of pdf-parse)
    const data = await parser.getText(); // 🔴 ERROR HERE (getText() is not a valid method in pdf-parse)

    return {
      text: data.text,
      numPages: data.numpages,
      info: data.info,
    };
  } catch (error) {
    console.error("PDF parsing error:", error);
    throw new Error("Failed to extract text from PDF");
  }
};
