/*
  Warnings:

  - You are about to drop the column `imagePath` on the `auctions` table. All the data in the column will be lost.
  - You are about to drop the column `contactName` on the `batches` table. All the data in the column will be lost.
  - You are about to drop the column `contactPhone` on the `batches` table. All the data in the column will be lost.
  - You are about to drop the column `image1` on the `batches` table. All the data in the column will be lost.
  - You are about to drop the column `image2` on the `batches` table. All the data in the column will be lost.
  - You are about to drop the column `image3` on the `batches` table. All the data in the column will be lost.
  - You are about to drop the column `image4` on the `batches` table. All the data in the column will be lost.
  - You are about to drop the column `image5` on the `batches` table. All the data in the column will be lost.
  - Added the required column `imageBase64` to the `auctions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image1Base64` to the `batches` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image2Base64` to the `batches` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image3Base64` to the `batches` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image4Base64` to the `batches` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image5Base64` to the `batches` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "auctions" DROP COLUMN "imagePath",
ADD COLUMN     "imageBase64" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "batches" DROP COLUMN "contactName",
DROP COLUMN "contactPhone",
DROP COLUMN "image1",
DROP COLUMN "image2",
DROP COLUMN "image3",
DROP COLUMN "image4",
DROP COLUMN "image5",
ADD COLUMN     "image1Base64" TEXT NOT NULL,
ADD COLUMN     "image2Base64" TEXT NOT NULL,
ADD COLUMN     "image3Base64" TEXT NOT NULL,
ADD COLUMN     "image4Base64" TEXT NOT NULL,
ADD COLUMN     "image5Base64" TEXT NOT NULL;
