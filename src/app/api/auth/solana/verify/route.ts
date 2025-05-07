import { NextRequest, NextResponse } from "next/server";
import { PublicKey } from "@solana/web3.js";
import { sign } from "tweetnacl";
import { challengeStore } from "../challenge/route";
import { SignJWT } from "jose";
import { getJwtSecretKey } from "@/lib/auth";
export async function POST(request: NextRequest) {
  try {
    const { walletAddress, challenge, signature } = await request.json();

    // Validate the request body
    if (!walletAddress || !challenge || !signature) {
      return NextResponse.json(
        { error: "Wallet address, challenge, and signature are required" },
        { status: 400 }
      );
    }

    // Get the stored challenge for this wallet
    const storedChallenge = challengeStore.get(walletAddress);
    if (!storedChallenge || storedChallenge.challenge !== challenge) {
      return NextResponse.json(
        { error: "Invalid or expired challenge" },
        { status: 400 }
      );
    }

    // Validate the signature
    const isValidSignature = verifySignature(
      walletAddress,
      challenge,
      Uint8Array.from(signature)
    );

    if (!isValidSignature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Delete the challenge after successful verification
    challengeStore.delete(walletAddress);

    // Create a JWT token
    const token = await createToken(walletAddress);

    // Fetch or create the user in your database
    // This is where you'd typically query your database
    // For now, we'll create a simple user object
    const user = {
      id: walletAddress,
      walletAddress,
      // You can add more user info if needed
    };

    return NextResponse.json({
      token,
      user,
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

async function createToken(walletAddress: string): Promise<string> {
  // Create a JWT token that expires in 7 days
  const secretKey = getJwtSecretKey();

  const token = await new SignJWT({ walletAddress })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(new TextEncoder().encode(secretKey));

  return token;
}
