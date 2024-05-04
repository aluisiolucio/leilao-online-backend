import { Auction } from "@prisma/client"
import { AuctionData, QueryParamsAuction } from "../../types/auction"

export interface IAuctionRepository {
    createAuction(auctionData: AuctionData, currentUser: string): Promise<Auction>
    getAuctions(params: QueryParamsAuction, currentUser: string): Promise<any>
    getAuctionById(id: string): Promise<any>
    updateAuction(id: string, title: string, description: string): Promise<Auction>
    deleteAuction(id: string): Promise<void>
    ownerAuction(id: string, currentUser: string): Promise<boolean>
}
