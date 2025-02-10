import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { url, title, tags } = await request.json();
    console.log("Request Body:", { url, title, tags });
    const userId = request.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json({ error: "User ID not found" }, { status: 401 });
    }

    const resource = await prisma.resource.create({
      data: {
        url,
        title,
        userId,
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
