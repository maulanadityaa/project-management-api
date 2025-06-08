/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `mst_user` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "mst_user" ADD COLUMN     "email" TEXT;

-- CreateTable
CREATE TABLE "mst_email_code" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "is_used" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "mst_email_code_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "mst_user_email_key" ON "mst_user"("email");

-- AddForeignKey
ALTER TABLE "mst_email_code" ADD CONSTRAINT "mst_email_code_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "mst_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
