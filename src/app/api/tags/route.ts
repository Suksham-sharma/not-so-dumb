import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { name } = await request.json();
    const userId = request.headers.get("x-user-id");

    console.log("User ID", userId);

    if (!userId)
      return NextResponse.json({ error: "User ID not found" }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const existingTag = await prisma.tag.findUnique({
      where: { name },
    });

    if (existingTag) return NextResponse.json(existingTag);

    const tag = await prisma.tag.create({
      data: { name, userId },
    });

    return NextResponse.json(tag);
  } catch (error: any) {
    console.error("Error creating tag:", error.message);
    return NextResponse.json(
      { error: "Failed to create tag" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = request.headers.get("x-user-id");

    if (!userId)
      return NextResponse.json({ error: "User ID not found" }, { status: 401 });

    const query = searchParams.get("q") || "";

    const tags = await prisma.tag.findMany({
      where: {
        userId,
        name: {
          contains: query.toLowerCase(),
          mode: "insensitive",
        },
      },
    });

    return NextResponse.json(tags);
  } catch (error) {
    console.error("Error fetching tags:", error);
    return NextResponse.json(
      { error: "Failed to fetch tags" },
      { status: 500 }
    );
  }
}
