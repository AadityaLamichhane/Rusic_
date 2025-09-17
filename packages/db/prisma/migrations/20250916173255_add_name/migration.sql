/*
  Warnings:

  - You are about to drop the column `sectionId` on the `Stream` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[url,sectionname]` on the table `Stream` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[urlId,sectionname]` on the table `Stream` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sectionname` to the `Stream` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Stream" DROP CONSTRAINT "Stream_sectionId_fkey";

-- DropIndex
DROP INDEX "public"."Stream_urlId_sectionId_key";

-- DropIndex
DROP INDEX "public"."Stream_url_sectionId_key";

-- AlterTable
ALTER TABLE "public"."Stream" DROP COLUMN "sectionId",
ADD COLUMN     "sectionname" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Stream_url_sectionname_key" ON "public"."Stream"("url", "sectionname");

-- CreateIndex
CREATE UNIQUE INDEX "Stream_urlId_sectionname_key" ON "public"."Stream"("urlId", "sectionname");

-- AddForeignKey
ALTER TABLE "public"."Stream" ADD CONSTRAINT "Stream_sectionname_fkey" FOREIGN KEY ("sectionname") REFERENCES "public"."Section"("Sectionname") ON DELETE RESTRICT ON UPDATE CASCADE;
