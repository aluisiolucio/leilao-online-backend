/*
  Warnings:

  - You are about to drop the column `imageBase64` on the `auctions` table. All the data in the column will be lost.
  - You are about to drop the column `image1Base64` on the `batches` table. All the data in the column will be lost.
  - You are about to drop the column `image2Base64` on the `batches` table. All the data in the column will be lost.
  - You are about to drop the column `image3Base64` on the `batches` table. All the data in the column will be lost.
  - You are about to drop the column `image4Base64` on the `batches` table. All the data in the column will be lost.
  - You are about to drop the column `image5Base64` on the `batches` table. All the data in the column will be lost.
  - Added the required column `imagePath` to the `auctions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imagePath1` to the `batches` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imagePath2` to the `batches` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imagePath3` to the `batches` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imagePath4` to the `batches` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imagePath5` to the `batches` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "auctions" DROP COLUMN "imageBase64",
ADD COLUMN     "imagePath" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "batches" DROP COLUMN "image1Base64",
DROP COLUMN "image2Base64",
DROP COLUMN "image3Base64",
DROP COLUMN "image4Base64",
DROP COLUMN "image5Base64",
ADD COLUMN     "imagePath1" TEXT NOT NULL,
ADD COLUMN     "imagePath2" TEXT NOT NULL,
ADD COLUMN     "imagePath3" TEXT NOT NULL,
ADD COLUMN     "imagePath4" TEXT NOT NULL,
ADD COLUMN     "imagePath5" TEXT NOT NULL;
