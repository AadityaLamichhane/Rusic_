/*
  Warnings:

  - A unique constraint covering the columns `[Sectionname]` on the table `Section` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Section_Sectionname_key" ON "public"."Section"("Sectionname");
