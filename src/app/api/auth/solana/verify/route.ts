import { NextRequest, NextResponse } from "next/server";
import { PublicKey } from "@solana/web3.js";
import { sign } from "tweetnacl";
import { challengeStore } from "@/lib/challengeStore";
import { SignJWT } from "jose";
import { getJwtSecretKey } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { walletAddress, challenge, signature } = await request.json();

    if (!walletAddress || !challenge || !signature) {
      return NextResponse.json(
        { error: "Wallet address, challenge, and signature are required" },
        { status: 400 }
      );
    }

    const storedChallenge = challengeStore.get(walletAddress);
    if (!storedChallenge || storedChallenge.challenge !== challenge) {
      return NextResponse.json(
        { error: "Invalid or expired challenge" },
        { status: 400 }
      );
    }

    const isValidSignature = verifySignature(
      walletAddress,
      challenge,
      Uint8Array.from(signature)
    );

    if (!isValidSignature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    challengeStore.delete(walletAddress);

    let user = await prisma.user.findUnique({
      where: { walletAddress },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          walletAddress,
          name: `Wallet ${walletAddress.slice(0, 4)}...${walletAddress.slice(
            -4
          )}`,
        },
      });
    }

    const token = await createToken(user.id);

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        walletAddress: user.walletAddress,
      },
    });
  } catch (error) {
    console.error("Error verifying signature:", error);
    return NextResponse.json(
      { error: "Failed to verify signature" },
      { status: 500 }
    );
  }
}

function verifySignature(
  walletAddress: string,
  message: string,
  signature: Uint8Array
): boolean {
  try {
    const publicKey = new PublicKey(walletAddress);
    const encodedMessage = new TextEncoder().encode(message);

    return sign.detached.verify(encodedMessage, signature, publicKey.toBytes());
  } catch (error) {
    console.error("Error verifying signature:", error);
    return false;
  }
}

async function createToken(userId: string): Promise<string> {
  // Create a JWT token that expires in 7 days
  const secretKey = getJwtSecretKey();

  const token = await new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(new TextEncoder().encode(secretKey));

  return token;
}
