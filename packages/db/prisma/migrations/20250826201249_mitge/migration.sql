/*
  Warnings:

  - A unique constraint covering the columns `[urlId,sectionId]` on the table `Stream` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."Stream_urlId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Stream_urlId_sectionId_key" ON "public"."Stream"("urlId", "sectionId");
