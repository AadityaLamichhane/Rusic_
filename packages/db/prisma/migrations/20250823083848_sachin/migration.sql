/*
  Warnings:

  - You are about to drop the column `id` on the `Section` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."Section_id_key";

-- AlterTable
ALTER TABLE "public"."Section" DROP COLUMN "id";
