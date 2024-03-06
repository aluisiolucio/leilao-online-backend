import { prisma } from '../db/prisma'
import { IAuctionRepository } from './ports/AuctionRepositoryInterface'

export class AuctionRepository implements IAuctionRepository {
    public async createAuction(title: string, description: string, startDateTime: Date, currentUser: string): Promise<object> {
        const auction = await prisma.auction.create({
            data: {
                title,
                description,
                startDateTime,
                ownerId: currentUser
            }
        })

        return { id: auction.id, title: auction.title, description: auction.description, startDateTime: auction.startDateTime }
    }

    public async getAuction(): Promise<object> {
        const auctions = await prisma.auction.findMany({
            select: {
                id: true,
                title: true,
                description: true,
                startDateTime: true,
                ownerId: true
            }
        })

        return auctions
    }
}