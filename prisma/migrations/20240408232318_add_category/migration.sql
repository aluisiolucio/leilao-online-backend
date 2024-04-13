/*
  Warnings:

  - Added the required column `category` to the `auctions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "auctions" ADD COLUMN     "category" TEXT NOT NULL;
