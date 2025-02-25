import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { type = "link", url, title, tags, image, content, pattern } = await request.json();
    console.log("Request Body:", { type, url, title, tags, content });
    const userId = request.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json({ error: "User ID not found" }, { status: 401 });
    }

    if (type !== "link" && type !== "note") {
      return NextResponse.json(
        { error: "Invalid resource type. Must be 'link' or 'note'" },
        { status: 400 }
      );
    }

    if (type === "link" && !url) {
      return NextResponse.json(
        { error: "URL is required for link type resources" },
        { status: 400 }
      );
    }

    const resource = await prisma.resource.create({
      data: {
        type,
        url,
        title,
        userId,
        image,
        content,
        pattern,
        tags: {
          connect: tags.map((tag: string) => ({
            name: tag,
          })),
        },
      },
      include: {
        tags: true,
      },
    });

    const transformedResource = {
      ...resource,
      tags: resource.tags.map((tag) => tag.name),
    };

    return NextResponse.json(transformedResource);
  } catch (error: any) {
    console.error("Error creating resource:", error.message);
    return NextResponse.json(
      { error: "Failed to create resource" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const userId = request.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json({ error: "User ID not found" }, { status: 401 });
    }

    const resources = await prisma.resource.findMany({
      where: { userId },
      include: { tags: true },
    });

    const transformedResources = resources.map((resource) => ({
      ...resource,
      tags: resource.tags.map((tag) => tag.name),
    }));

    return NextResponse.json(transformedResources);
  } catch (error) {
    console.error("Error fetching resources:", error);
    return NextResponse.json(
      { error: "Failed to fetch resources" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const userId = request.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json({ error: "User ID not found" }, { status: 401 });
    }

    if (!id) {
      return NextResponse.json(
        { error: "Resource ID not found" },
        { status: 400 }
      );
    }

    const resource = await prisma.resource.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!resource) {
      return NextResponse.json(
        { error: "Resource not found or unauthorized" },
        { status: 404 }
      );
    }

    // Delete the resource
    await prisma.resource.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting resource:", error);
    return NextResponse.json(
      { error: "Failed to delete resource" },
      { status: 500 }
    );
  }
}
