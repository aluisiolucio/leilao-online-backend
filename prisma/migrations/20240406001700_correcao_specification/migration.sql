/*
  Warnings:

  - You are about to drop the column `especification` on the `batches` table. All the data in the column will be lost.
  - Added the required column `specification` to the `batches` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "batches" DROP COLUMN "especification",
ADD COLUMN     "specification" TEXT NOT NULL;
