-- CreateTable
CREATE TABLE "Challenge" (
    "id" TEXT NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "challenge" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Challenge_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Challenge_walletAddress_key" ON "Challenge"("walletAddress");
