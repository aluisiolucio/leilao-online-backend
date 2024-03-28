/*
  Warnings:

  - Added the required column `imagePath` to the `auctions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "auctions" ADD COLUMN     "imagePath" TEXT NOT NULL;
