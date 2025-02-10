import { NextResponse } from "next/server";
import { parse } from "node-html-parser";

const getHtml = async (url: string) => {
  return await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0",
    },
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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  try {
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
