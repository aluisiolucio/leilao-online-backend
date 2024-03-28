import { Auction } from "@prisma/client"

export interface IAuctionRepository {
    createAuction(title: string, description: string, imagePath: string, currentUser: string): Promise<Auction>
    getAuctions(limite: number, currentUser: string): Promise<object>
    getAuctionsByQuery(dataInicial: Date, dataFinal: Date, limite: number, currentUser: string): Promise<object>
    getAuctionById(id: string): Promise<Auction | null>
    updateAuction(id: string, title: string, description: string): Promise<Auction>
    deleteAuction(id: string): Promise<void>
    ownerAuction(id: string, currentUser: string): Promise<boolean>
}
