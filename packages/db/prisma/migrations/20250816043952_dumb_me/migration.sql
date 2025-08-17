/*
  Warnings:

  - You are about to drop the column `name` on the `Section` table. All the data in the column will be lost.
  - Added the required column `Sectionname` to the `Section` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Section" DROP COLUMN "name",
ADD COLUMN     "Sectionname" TEXT NOT NULL;
