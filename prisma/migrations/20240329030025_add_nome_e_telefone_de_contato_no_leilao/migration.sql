/*
  Warnings:

  - Added the required column `contactName` to the `auctions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contactPhone` to the `auctions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "auctions" ADD COLUMN     "contactName" TEXT NOT NULL,
ADD COLUMN     "contactPhone" TEXT NOT NULL;
