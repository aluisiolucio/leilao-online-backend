import { z } from 'zod';
import { schemaError } from '../errors/schemaError';
import { AuctionRepository } from '../repositories/AuctionRepository';
import { AuctionUseCase } from '../useCases/AuctionUseCase';

export class AuctionController {
    private auctionRepository: AuctionRepository

    constructor() {
        this.auctionRepository = new AuctionRepository()
    }

    public async createAuction(requestBody: unknown, currentUser: string) {
        const createAuctionSchema = z.object({
            title: z.string(),
            description: z.string(),
            startDateTime: z.string().datetime({ offset: true })
        }).safeParse(requestBody)

        if (!createAuctionSchema.success) {
            schemaError(createAuctionSchema)
        }

        const { title, description, startDateTime } = createAuctionSchema.data

        const auctionUseCase = new AuctionUseCase(this.auctionRepository)
        const auction = await auctionUseCase.createAuction(title, description, startDateTime, currentUser)

        return auction
    }

    public async getAuction() {
        const auctionUseCase = new AuctionUseCase(this.auctionRepository)
        const auctions = await auctionUseCase.getAuction()

        return auctions
    }
}