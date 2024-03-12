import { Auction } from "@prisma/client"

export interface IAuctionRepository {
    createAuction(title: string, description: string, currentUser: string): Promise<object>
    getAuction(): Promise<object>
    getAuctionById(id: string): Promise<Auction | null>
    updateAuction(id: string, title: string, description: string): Promise<object>
    deleteAuction(id: string): Promise<void>
}
