/*
  Warnings:

  - Added the required column `user_id` to the `mst_project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "mst_project" ADD COLUMN     "user_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "mst_project" ADD CONSTRAINT "mst_project_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "mst_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
