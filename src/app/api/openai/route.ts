import { NextResponse } from "next/server";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

if (!OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is not set in environment variables");
}

export const maxDuration = 30;
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const response = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages,
        stream: true,
        max_tokens: 4000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    if (!response.body) {
      throw new Error("No response body available");
    }

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          const reader = response.body?.getReader();
          if (!reader) throw new Error("No reader available");

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
