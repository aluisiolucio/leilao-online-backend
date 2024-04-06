import { Auction } from "@prisma/client"
import { AuctionData } from "../../types/auction"

export interface IAuctionRepository {
    createAuction(auctionData: AuctionData, currentUser: string): Promise<Auction>
    getAuctions(limite: number, currentUser: string): Promise<object>
    getAuctionsByQuery(dataInicial: Date, dataFinal: Date, limite: number, currentUser: string): Promise<object>
    getAuctionsByUser(currentUser: string, limite: number): Promise<object>
    getAuctionById(id: string): Promise<Auction | null>
    updateAuction(id: string, title: string, description: string): Promise<Auction>
    deleteAuction(id: string): Promise<void>
    ownerAuction(id: string, currentUser: string): Promise<boolean>
}
