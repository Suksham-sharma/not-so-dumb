import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const protectedPaths = [
  "/home",
  "/quiz/test",
  "/quiz",
  "/profile",
  "/second-brain",
  "/api/tags",
  "/api/resources",
  "/api/brain-chat",
];

export const authRoutes = ["/login", "/signup"];

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (pathname.match(/^\/quiz\/[^/]+$/) && pathname !== "/quiz/test") {
    return NextResponse.next();
  }

  const isProtectedPath = protectedPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  if (!isProtectedPath) {
    return NextResponse.next();
  }

  let token: string | undefined;
  const authHeader = request.headers.get("Authorization");
  if (authHeader?.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    const tokenFromCookie = request.cookies.get("token");
    token = tokenFromCookie?.value;
  }

  if (!token) {
    // Extract destination from URL or use the current path
    const urlSearchParams = new URLSearchParams(search);
    const destination =
      urlSearchParams.get("destination") || pathname.substring(1);

    // Create login URL with destination
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("destination", destination);

    return NextResponse.redirect(loginUrl);
  }

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET || "fallback-secret")
    );

    const response = NextResponse.next();

    if (payload.userId) {
      response.headers.set("x-user-id", payload.userId as string);
    } else if (payload.walletAddress) {
      response.headers.set("x-user-id", payload.walletAddress as string);
    }

    return response;
  } catch (error) {
    // Extract destination from URL or use the current path
    const urlSearchParams = new URLSearchParams(search);
    const destination =
      urlSearchParams.get("destination") || pathname.substring(1);

    // Create login URL with destination
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("destination", destination);

    return NextResponse.redirect(loginUrl);
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
    "/api/brain-chat/:path*",
  ],
};
