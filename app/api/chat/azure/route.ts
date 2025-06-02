import { StreamingTextResponse } from "ai"
import { OpenAIClient, AzureKeyCredential } from "@azure/openai"
import { NextRequest } from "next/server"

const endpoint = "https://saintsal-core-api-openai-96ea.openai.azure.com/"
const azureApiKey = "1afc1c88684a39b4a8a318345c9e04"
const deploymentId = "gpt-4o"

const client = new OpenAIClient(endpoint, new AzureKeyCredential(azureApiKey))

export async function POST(req: NextRequest) {
  const { messages } = await req.json()

  const response = await client.streamChatCompletions(deploymentId, messages, {
    temperature: 0.7
  })

  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      for await (const chunk of response) {
        const content = chunk.choices?.[0]?.delta?.content
        if (content) controller.enqueue(encoder.encode(content))
      }
      controller.close()
    }
  })

  return new StreamingTextResponse(stream)
}
