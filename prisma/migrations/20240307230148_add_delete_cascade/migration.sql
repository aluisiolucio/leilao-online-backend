-- DropForeignKey
ALTER TABLE "batches" DROP CONSTRAINT "batches_auctionId_fkey";

-- AddForeignKey
ALTER TABLE "batches" ADD CONSTRAINT "batches_auctionId_fkey" FOREIGN KEY ("auctionId") REFERENCES "auctions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
