/*
  Warnings:

  - Added the required column `name` to the `Section` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Section" ADD COLUMN     "name" TEXT NOT NULL;
