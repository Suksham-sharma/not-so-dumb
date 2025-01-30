import { NextResponse } from "next/server";
import axios from "axios";

const TAVILY_API_KEY = process.env.TAVILY_API_KEY;
const TAVILY_EXTRACT_URL = "https://api.tavily.com/extract";

if (!TAVILY_API_KEY) {
  throw new Error("TAVILY_API_KEY is not set in environment variables");
}

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "URL is required and must be a string" },
        { status: 400 }
      );
    }

    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 }
      );
    }

    const response = await axios.post(
      TAVILY_EXTRACT_URL,
      {
        api_key: TAVILY_API_KEY,
        urls: [url],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Content extraction error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to extract content",
      },
      { status: 500 }
    );
  }
}
