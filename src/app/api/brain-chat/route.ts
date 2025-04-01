import { NextResponse } from "next/server";
import { searchPinecone } from "@/lib/pinecone";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { query, resourceId } = await request.json();
    const userId = request.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json({ error: "User ID not found" }, { status: 401 });
    }

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    // Search Pinecone for relevant documents
    const searchResults = await searchPinecone({
      query,
      userId,
      resourceId,
    });

    // Format context from search results
    const context = searchResults
      .map((doc) => {
        const metadata = doc.metadata as any;
        return `Title: ${metadata.title}\nType: ${metadata.type}\n${
          metadata.content ? `Content: ${metadata.content}\n` : ""
        }${
          metadata.url ? `URL: ${metadata.url}\n` : ""
        }Tags: ${metadata.tags.join(", ")}\n`;
      })
      .join("\n");

    // Generate response using OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: `You are a helpful AI assistant that answers questions based on the user's saved resources. 
          Use the provided context to answer the user's question. If the context doesn't contain relevant information, 
          say so politely. Always cite the sources you use from the context.`,
        },
        {
          role: "user",
          content: `Context:\n${context}\n\nQuestion: ${query}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    return NextResponse.json({
      answer: completion.choices[0].message.content,
      sources: searchResults.map((doc) => ({
        title: (doc.metadata as any).title,
        type: (doc.metadata as any).type,
        url: (doc.metadata as any).url,
      })),
    });
  } catch (error) {
    console.error("Error in brain chat:", error);
    return NextResponse.json(
      { error: "Failed to process brain chat request" },
      { status: 500 }
    );
  }
}
