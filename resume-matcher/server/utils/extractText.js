import pdfParse from "pdf-parse/lib/pdf-parse.js";
import mammoth from "mammoth";

/**
 * Extracts plain text from an uploaded resume file buffer.
 * Supports PDF, DOCX, and plain text.
 */
export async function extractTextFromFile(buffer, mimetype, originalName = "") {
  const lowerName = originalName.toLowerCase();

  if (mimetype === "application/pdf" || lowerName.endsWith(".pdf")) {
    const data = await pdfParse(buffer);
    return cleanText(data.text);
  }

  if (
    mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    lowerName.endsWith(".docx")
  ) {
    const result = await mammoth.extractRawText({ buffer });
    return cleanText(result.value);
  }

  if (mimetype === "text/plain" || lowerName.endsWith(".txt")) {
    return cleanText(buffer.toString("utf-8"));
  }

  throw new Error(
    "Unsupported file type. Please upload a PDF, DOCX, or TXT resume."
  );
}

function cleanText(text) {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
