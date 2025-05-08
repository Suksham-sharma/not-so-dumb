export const challengeStore = new Map<
  string,
  { challenge: string; createdAt: number }
>();

export function cleanupExpiredChallenges() {
  const now = Date.now();
  const expirationTime = 5 * 60 * 1000;

  challengeStore.forEach((value, key) => {
    if (now - value.createdAt > expirationTime) {
      challengeStore.delete(key);
    }
  });
}
