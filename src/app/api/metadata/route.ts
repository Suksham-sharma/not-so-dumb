import { NextResponse } from "next/server";
import { parse } from "node-html-parser";

const getHtml = async (url: string) => {
  const headers = {
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
    Accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    "Accept-Encoding": "gzip, deflate, br",
    Connection: "keep-alive",
    "Upgrade-Insecure-Requests": "1",
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "none",
    "Sec-Fetch-User": "?1",
    "Cache-Control": "max-age=0",
  };

  return await fetch(url, {
    headers,
    next: { revalidate: 3600 },
  })
    .then((r) => r.text())
    .catch(() => null);
};

const getHeadChildNodes = (html: string) => {
  const ast = parse(html);
  const metaTags = ast.querySelectorAll("meta").map(({ attributes }) => {
    const property = attributes.property || attributes.name || attributes.href;
    return {
      property,
      content: attributes.content,
    };
  });
  const title = ast.querySelector("title")?.innerText;
  const linkTags = ast.querySelectorAll("link").map(({ attributes }) => {
    const { rel, href } = attributes;
    return {
      rel,
      href,
    };
  });

  return { metaTags, title, linkTags };
};

const getRelativeUrl = (url: string, imageUrl: string | null) => {
  if (!imageUrl) {
    return null;
  }
  try {
    if (new URL(imageUrl).protocol) {
      return imageUrl;
    }
  } catch {}
  const { protocol, host } = new URL(url);
  const baseURL = `${protocol}//${host}`;
  return new URL(imageUrl, baseURL).toString();
};

const getYoutubeMetadata = async (url: string) => {
  const videoId = url.match(
    /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/i
  )?.[1];
  if (!videoId) return null;

  try {
    const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
    if (!YOUTUBE_API_KEY) {
      console.error("YouTube API key is not configured");
      return null;
    }

    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${YOUTUBE_API_KEY}`,
      {
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) {
      console.error("YouTube API request failed:", response.statusText);
      return null;
    }

    const data = await response.json();
    const video = data.items?.[0]?.snippet;

    if (!video) {
      return null;
    }

    return {
      title: video.title,
      description: video.description,
      image: `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
    };
  } catch (error) {
    console.error("Error fetching YouTube metadata:", error);
    return null;
  }
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  try {
    // Try YouTube-specific metadata first
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      const youtubeMetadata = await getYoutubeMetadata(url);
      if (youtubeMetadata) {
        return NextResponse.json(youtubeMetadata);
      }
    }

    const html = await getHtml(url);
    if (!html) {
      return NextResponse.json({
        title: url,
        description: "No description available",
        image: null,
      });
    }

    const { metaTags, title: titleTag, linkTags } = getHeadChildNodes(html);

    const metadata: Record<string, string> = {};

    metaTags.forEach(({ property, content }) => {
      if (property && !metadata[property] && content) {
        metadata[property] = content;
      }
    });

    linkTags.forEach(({ rel, href }) => {
      if (rel && !metadata[rel] && href) {
        metadata[rel] = href;
      }
    });

    const title =
      metadata["og:title"] || metadata["twitter:title"] || titleTag || url;
    const description =
      metadata["description"] ||
      metadata["og:description"] ||
      metadata["twitter:description"] ||
      "No description available";
    const image = getRelativeUrl(
      url,
      metadata["og:image"] ||
        metadata["twitter:image"] ||
        metadata["image_src"] ||
        metadata["icon"] ||
        metadata["shortcut icon"]
    );

    return NextResponse.json({
      title,
      description,
      image,
    });
  } catch (error) {
    console.error("Error fetching metadata:", error);
    return NextResponse.json(
      { error: "Failed to fetch metadata" },
      { status: 500 }
    );
  }
}
