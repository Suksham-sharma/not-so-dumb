/*
  Warnings:

  - You are about to drop the column `articleLink` on the `Quiz` table. All the data in the column will be lost.
  - You are about to drop the column `difficulty` on the `Quiz` table. All the data in the column will be lost.
  - You are about to drop the column `topic` on the `Quiz` table. All the data in the column will be lost.
  - You are about to drop the column `youtubeLink` on the `Quiz` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Quiz" DROP COLUMN "articleLink",
DROP COLUMN "difficulty",
DROP COLUMN "topic",
DROP COLUMN "youtubeLink";
