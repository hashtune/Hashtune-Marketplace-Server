/*
  Warnings:

  - You are about to drop the `_creators` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_creators" DROP CONSTRAINT "_creators_A_fkey";

-- DropForeignKey
ALTER TABLE "_creators" DROP CONSTRAINT "_creators_B_fkey";

-- AlterTable
ALTER TABLE "Artwork" ADD COLUMN     "streamCount" INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "_creators";

-- CreateTable
CREATE TABLE "_features" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_features_AB_unique" ON "_features"("A", "B");

-- CreateIndex
CREATE INDEX "_features_B_index" ON "_features"("B");

-- AddForeignKey
ALTER TABLE "_features" ADD FOREIGN KEY ("A") REFERENCES "Artwork"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_features" ADD FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
