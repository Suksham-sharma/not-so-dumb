import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  let token: string | undefined;

  const authHeader = request.headers.get("Authorization");
  if (authHeader?.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    const tokenFromCookie = request.cookies.get("token");
    token = tokenFromCookie?.value;
  }

  const protectedPaths = [
    "/home",
    "/quiz/test",
    "/quiz",
    "/profile",
    "/second-brain",
    "/api/tags",
    "/api/resources",
  ];
  const isProtectedPath = protectedPaths.some(
    (path) => request.nextUrl.pathname === path
  );

  if (
    request.nextUrl.pathname.match(/^\/quiz\/[^/]+$/) &&
    request.nextUrl.pathname !== "/quiz/test"
  ) {
    return NextResponse.next();
  }

  if (!isProtectedPath) {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET || "fallback-secret")
    );

    const response = NextResponse.next();

    response.headers.set("x-user-id", payload.userId as string);
    return response;
  } catch (error) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: [
    "/quiz/:path*",
    "/profile/:path*",
    "/api/resources/:path*",
    "/api/tags/:path*",
    "/api/:path*",
    "/home/:path*",
    "/second-brain/:path*",
  ],
};
