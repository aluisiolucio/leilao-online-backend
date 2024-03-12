/*
  Warnings:

  - You are about to drop the column `startDateTime` on the `auctions` table. All the data in the column will be lost.
  - Added the required column `startDateTime` to the `batches` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "auctions" DROP COLUMN "startDateTime";

-- AlterTable
ALTER TABLE "batches" ADD COLUMN     "startDateTime" TIMESTAMP(3) NOT NULL;
