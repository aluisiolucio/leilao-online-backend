/*
  Warnings:

  - You are about to drop the column `number` on the `batches` table. All the data in the column will be lost.
  - Added the required column `code` to the `batches` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "batches" DROP COLUMN "number",
ADD COLUMN     "code" INTEGER NOT NULL;
