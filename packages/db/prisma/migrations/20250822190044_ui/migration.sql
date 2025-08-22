-- DropForeignKey
ALTER TABLE "public"."Stream" DROP CONSTRAINT "Stream_sectionId_fkey";

-- AddForeignKey
ALTER TABLE "public"."Stream" ADD CONSTRAINT "Stream_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "public"."Section"("Sectionname") ON DELETE RESTRICT ON UPDATE CASCADE;
