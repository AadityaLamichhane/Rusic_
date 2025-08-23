/*
  Warnings:

  - A unique constraint covering the columns `[url,sectionId]` on the table `Stream` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."Stream_url_key";

-- CreateIndex
CREATE UNIQUE INDEX "Stream_url_sectionId_key" ON "public"."Stream"("url", "sectionId");
