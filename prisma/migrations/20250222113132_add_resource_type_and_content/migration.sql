-- AlterTable
ALTER TABLE "Resource" ADD COLUMN     "content" TEXT,
ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'link',
ALTER COLUMN "url" DROP NOT NULL;
