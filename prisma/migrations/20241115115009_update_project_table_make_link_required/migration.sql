/*
  Warnings:

  - Made the column `link` on table `mst_project` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "mst_project" ALTER COLUMN "link" SET NOT NULL;
