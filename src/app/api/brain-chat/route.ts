import { NextResponse } from "next/server";
import { searchPinecone } from "@/lib/pinecone";
import { prompts } from "@/lib/prompts";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { query, resourceId } = await request.json();
    const userId = request.headers.get("x-user-id");

    if (!userId || !query) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const searchResults = await searchPinecone({ query, userId, resourceId });
    const hasContext = searchResults.length > 0;

    const context = hasContext
      ? searchResults
          .map((doc) => {
            const { title, type, content, url, tags } = doc.metadata as any;
            return `[Resource]
Title: ${title}
Type: ${type}
${content ? `Content: ${content}\n` : ""}
${url ? `URL: ${url}\n` : ""}
Tags: ${tags.join(", ")}`;
          })
          .join("\n\n")
      : "";

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: prompts.system },
        {
          role: "user",
          content: hasContext
            ? `Context:\n${context}\n\nQuestion: ${query}`
            : query,
        },
      ],
      temperature: hasContext ? 0.3 : 0.7,
      max_tokens: hasContext ? 500 : 150,
    });

    return NextResponse.json({
      answer: response.choices[0].message.content,
      sources: hasContext
        ? searchResults.map((doc) => ({
            title: (doc.metadata as any).title,
            type: (doc.metadata as any).type,
            url: (doc.metadata as any).url,
          }))
        : [],
    });
  } catch (error) {
    console.error("Error in brain chat:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
