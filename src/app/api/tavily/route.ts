import { NextResponse } from "next/server";
import axios from "axios";

const TAVILY_API_KEY = process.env.TAVILY_API_KEY;
const TAVILY_API_URL = "https://api.tavily.com/search";

if (!TAVILY_API_KEY) {
  throw new Error("TAVILY_API_KEY is not set in environment variables");
}

export async function POST(req: Request) {
  try {
    const { query, includeImages, includeImageDescriptions } = await req.json();

    const response = await axios.post(
      TAVILY_API_URL,
      {
        query,
        include_answer: true,
        search_depth: "advanced",
        api_key: TAVILY_API_KEY,
        include_images: includeImages,
        include_image_descriptions: includeImageDescriptions,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "api-key": TAVILY_API_KEY,
        },
      }
    );

    const data = response.data;

    if (!data.results) {
      console.error("Invalid Tavily API response:", data);
      throw new Error("Invalid response format from Tavily API");
    }

    if (data.answer) {
      data.results.unshift({
        title: "AI Generated Answer",
        content: data.answer,
        url: "Generated from Tavily's answer",
      });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Tavily API Error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to process request",
      },
      { status: 500 }
    );
  }
}
