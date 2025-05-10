import { FileItemChunk } from "@/types"
import { encode } from "gpt-tokenizer"
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"
import { CHUNK_OVERLAP, CHUNK_SIZE } from "."

export const processCSV = async (csv: Blob): Promise<FileItemChunk[]> => {
  const text = await csv.text()

  const docs = [{ pageContent: text }]

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: CHUNK_SIZE,
    chunkOverlap: CHUNK_OVERLAP,
    separators: ["\n\n"]
  })

  const splitDocs = await splitter.createDocuments([text])

  const chunks: FileItemChunk[] = splitDocs.map((doc, index) => ({
    id: `chunk-${index}`,
    content: doc.pageContent,
    tokens: encode(doc.pageContent).length
  }))

  return chunks
}
