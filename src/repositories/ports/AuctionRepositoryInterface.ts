import { Auction } from "@prisma/client"

export interface IAuctionRepository {
    createAuction(title: string, description: string, currentUser: string): Promise<Auction>
    getAuction(): Promise<object>
    getAuctionById(id: string): Promise<Auction | null>
    updateAuction(id: string, title: string, description: string): Promise<Auction>
    deleteAuction(id: string): Promise<void>
    ownerAuction(id: string, currentUser: string): Promise<boolean>
}
