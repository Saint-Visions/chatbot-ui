import { Document } from "langchain/document"
import * as fs from "fs"
import pdfParse from "pdf-parse"

export async function runPdfExtraction(filePath: string): Promise<Document[]> {
  const dataBuffer = fs.readFileSync(filePath)
  const data = await pdfParse(dataBuffer)

  return [
    new Document({
      pageContent: data.text,
      metadata: { source: filePath }
    })
  ]
}
