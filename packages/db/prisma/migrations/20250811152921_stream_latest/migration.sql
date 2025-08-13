/*
  Warnings:

  - Added the required column `sectionId` to the `Stream` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Stream" ADD COLUMN     "sectionId" TEXT NOT NULL,
ALTER COLUMN "type" SET DEFAULT 'youtube';

-- AddForeignKey
ALTER TABLE "public"."Stream" ADD CONSTRAINT "Stream_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "public"."Section"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
