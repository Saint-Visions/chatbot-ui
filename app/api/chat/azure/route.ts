import { StreamingTextResponse } from "ai"
import OpenAI from "@azure/openai"

const azureOpenai = new OpenAI({
  apiKey: process.env.AZURE_OPENAI_API_KEY,
  baseURL: `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT_ID}`,
  defaultQuery: { "api-version": "2023-12-01-preview" },
  defaultHeaders: { "api-key": process.env.AZURE_OPENAI_API_KEY }
})

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    const response = await azureOpenai.chat.completions.create({
      model: process.env.AZURE_OPENAI_DEPLOYMENT_ID!,
      messages,
      temperature: 0.7,
      stream: true
    })

    // ✅ Azure-compatible streaming response
    const stream = response as unknown as ReadableStream<Uint8Array>
    return new Response(stream)
  } catch (error: any) {
    console.error("Azure error:", error)
    return new Response(
      JSON.stringify({ message: error?.message || "Azure failure" }),
      { status: 500 }
    )
  }
}
