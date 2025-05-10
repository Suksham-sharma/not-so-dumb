import { prisma } from "@/lib/prisma";

export async function setChallenge(walletAddress: string, challenge: string) {
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  await prisma.challenge.upsert({
    where: { walletAddress },
    update: {
      challenge,
      expiresAt,
    },
    create: {
      walletAddress,
      challenge,
      expiresAt,
    },
  });
}

export async function getChallenge(walletAddress: string) {
  const challenge = await prisma.challenge.findUnique({
    where: { walletAddress },
  });

  if (!challenge || challenge.expiresAt < new Date()) {
    return null;
  }

  return challenge;
}

export async function deleteChallenge(walletAddress: string) {
  await prisma.challenge.delete({
    where: { walletAddress },
  });
}

export async function cleanupExpiredChallenges() {
  await prisma.challenge.deleteMany({
    where: {
      expiresAt: {
        lt: new Date(),
      },
    },
  });
}
