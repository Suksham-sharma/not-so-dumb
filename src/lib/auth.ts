import { jwtVerify, JWTVerifyResult } from "jose";

interface JWTPayload {
  walletAddress: string;
  iat: number;
  exp: number;
}

export function getJwtSecretKey(): string {
  const secret = process.env.JWT_SECRET_KEY;

  if (!secret) {
    throw new Error("JWT_SECRET_KEY is not set in environment variables");
  }

  return secret;
}

export async function verifyJwtToken(
  token: string
): Promise<JWTVerifyResult<JWTPayload>> {
  try {
    const verified = await jwtVerify<JWTPayload>(
      token,
      new TextEncoder().encode(getJwtSecretKey())
    );

    return verified;
  } catch (error) {
    console.error("Error verifying JWT:", error);
    throw new Error("Your token is invalid or has expired.");
  }
}

export async function validateTokenFromCookies(cookies: {
  [key: string]: string;
}): Promise<JWTPayload | null> {
  const token = cookies.token;

  if (!token) {
    return null;
  }

  try {
    const { payload } = await verifyJwtToken(token);
    return payload;
  } catch (error) {
    console.error("Error validating token from cookies:", error);
    return null;
  }
}
