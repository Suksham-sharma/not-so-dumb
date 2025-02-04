import { NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const response = await axios.get(url);
    const html = response.data;

    const $ = cheerio.load(html);

    $("script, style, nav, header, footer, iframe, .ads").remove();

    const content = $("article, .article, .post, .content, main")
      .first()
      .text()
      .trim()
      .replace(/\s+/g, " ");

    if (!content) {
      return NextResponse.json(
        { error: "Could not extract content from the provided URL" },
        { status: 401 }
      );
    }

    return NextResponse.json({ content });
  } catch (error) {
    console.error("Error fetching article:", error);
    return NextResponse.json(
      { error: "Failed to fetch article content" },
      { status: 500 }
    );
  }
}
