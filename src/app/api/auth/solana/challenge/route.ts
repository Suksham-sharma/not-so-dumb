import { NextRequest, NextResponse } from "next/server";
import { webcrypto } from "crypto";

// In-memory storage (in production you'd use Redis or database)
const challengeStore = new Map<
  string,
  { challenge: string; createdAt: number }
>();

export async function POST(request: NextRequest) {
  try {
    const { walletAddress } = await request.json();

    if (!walletAddress) {
      return NextResponse.json(
        { error: "Wallet address is required" },
        { status: 400 }
      );
    }

    // Generate a random challenge
    const challenge = generateChallenge();

    // Store the challenge with expiration (5 minutes)
    challengeStore.set(walletAddress, {
      challenge,
      createdAt: Date.now(),
    });

    // Clean up expired challenges (older than 5 minutes)
    cleanupExpiredChallenges();

    return NextResponse.json({ challenge });
  } catch (error) {
    console.error("Error generating challenge:", error);
    return NextResponse.json(
      { error: "Failed to generate challenge" },
      { status: 500 }
    );
  }
}

// Generate a random challenge string
function generateChallenge(): string {
  // Create a message that the user needs to sign
  const randomBytes = webcrypto.getRandomValues(new Uint8Array(32));
  const timestamp = Date.now();
  const message = `Sign this message to authenticate with our app: ${Buffer.from(
    randomBytes
  ).toString("hex")}-${timestamp}`;

  return message;
}

// Clean up challenges older than 5 minutes
function cleanupExpiredChallenges() {
  const now = Date.now();
  const expirationTime = 5 * 60 * 1000; // 5 minutes

  challengeStore.forEach((value, key) => {
    if (now - value.createdAt > expirationTime) {
      challengeStore.delete(key);
    }
  });
}

export { challengeStore };
