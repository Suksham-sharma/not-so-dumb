import { NextRequest, NextResponse } from "next/server";
import { webcrypto } from "crypto";
import { setChallenge, cleanupExpiredChallenges } from "@/lib/challengeStore";

export async function POST(request: NextRequest) {
  try {
    const { walletAddress } = await request.json();

    if (!walletAddress) {
      return NextResponse.json(
        { error: "Wallet address is required" },
        { status: 400 }
      );
    }

    const challenge = generateChallenge();
    await setChallenge(walletAddress, challenge);
    await cleanupExpiredChallenges();

    return NextResponse.json({ challenge });
  } catch (error) {
    console.error("Error generating challenge:", error);
    return NextResponse.json(
      { error: "Failed to generate challenge" },
      { status: 500 }
    );
  }
}

function generateChallenge(): string {
  const randomBytes = webcrypto.getRandomValues(new Uint8Array(32));
  const timestamp = Date.now();
  const message = `Sign this message to authenticate with our app: ${Buffer.from(
    randomBytes
  ).toString("hex")}-${timestamp}`;

  return message;
}
