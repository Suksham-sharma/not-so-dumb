import { NextResponse } from "next/server";
import axios from "axios";

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions";

if (!DEEPSEEK_API_KEY) {
  throw new Error("DEEPSEEK_API_KEY is not set in environment variables");
}

export const maxDuration = 30;

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const response = await axios.post(
      DEEPSEEK_API_URL,
      {
        model: "deepseek-reasoner",
        messages,
        stream: true,
        max_tokens: 4000,
        temperature: 0.7,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
        },
        responseType: "stream",
      }
    );

    if (!response.data) {
      throw new Error("No response data available");
    }

    const reader = response.data.getReader();
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          while (true) {
            const { done, value } = await reader.read();

            if (done) {
              controller.close();
              break;
            }

            const text = decoder.decode(value);
            const lines = text.split("\n");

            for (const line of lines) {
              if (line.trim() === "") continue;
              if (line.trim() === "data: [DONE]") continue;

              let data = line;
              if (line.startsWith("data: ")) {
                data = line.slice(6);
              }

              try {
                const parsed = JSON.parse(data);
                controller.enqueue(
                  encoder.encode(JSON.stringify(parsed) + "\n")
                );
              } catch (e) {
                console.error("Error parsing JSON:", e);
              }
            }
          }
        } catch (e) {
          controller.error(e);
        }
      },

      cancel() {
        reader.cancel();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to process request",
      },
      { status: 500 }
    );
  }
}
