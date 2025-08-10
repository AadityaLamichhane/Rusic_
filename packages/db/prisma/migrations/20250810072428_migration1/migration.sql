-- CreateEnum
CREATE TYPE "public"."Provider" AS ENUM ('Google');

-- CreateEnum
CREATE TYPE "public"."StreamType" AS ENUM ('youtube', 'spotify');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "provider" "public"."Provider" NOT NULL
);

-- CreateTable
CREATE TABLE "public"."Stream" (
    "id" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "userId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "urlId" TEXT NOT NULL,
    "type" "public"."StreamType" NOT NULL
);

-- CreateTable
CREATE TABLE "public"."Upvotes" (
    "id" TEXT NOT NULL,
    "streamid" TEXT NOT NULL,
    "userId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "public"."Section" (
    "id" TEXT NOT NULL,
    "createrId" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "public"."User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Stream_id_key" ON "public"."Stream"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Upvotes_id_key" ON "public"."Upvotes"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Upvotes_userId_streamid_key" ON "public"."Upvotes"("userId", "streamid");

-- CreateIndex
CREATE UNIQUE INDEX "Section_id_key" ON "public"."Section"("id");

-- AddForeignKey
ALTER TABLE "public"."Stream" ADD CONSTRAINT "Stream_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Upvotes" ADD CONSTRAINT "Upvotes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Upvotes" ADD CONSTRAINT "Upvotes_streamid_fkey" FOREIGN KEY ("streamid") REFERENCES "public"."Stream"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Section" ADD CONSTRAINT "Section_createrId_fkey" FOREIGN KEY ("createrId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
