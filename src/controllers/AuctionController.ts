import { z } from 'zod';
import { schemaError } from '../errors/schemaError';
import { AuctionRepository } from '../repositories/AuctionRepository';
import { AuctionUseCase } from '../useCases/AuctionUseCase';
import { HTTPError } from '../errors/httpError';

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
        return await auctionUseCase.createAuction(title, description, startDateTime, currentUser)
    }

    public async getAuction() {
        const auctionUseCase = new AuctionUseCase(this.auctionRepository)
        return await auctionUseCase.getAuction()
    }

    public async getAuctionById(id: string) {
        const auctionUseCase = new AuctionUseCase(this.auctionRepository)
        return await auctionUseCase.getAuctionById(id)
    }

    public async updateAuction(id: string, requestBody: unknown) {
        const updateAuctionSchema = z.object({
            title: z.string().optional(),
            description: z.string().optional(),
            startDateTime: z.string().datetime({ offset: true }).optional()
        }).safeParse(requestBody)

        if (!updateAuctionSchema.success) {
            schemaError(updateAuctionSchema)
        }

        const { title, description, startDateTime } = updateAuctionSchema.data

        if (!title && !description && !startDateTime) {
            throw new HTTPError(400, 'É necessário informar ao menos um campo para atualização')
        }

        const auctionUseCase = new AuctionUseCase(this.auctionRepository)
        return await auctionUseCase.updateAuction(id, title, description, startDateTime)
    }

    public async deleteAuction(id: string) {
        const auctionUseCase = new AuctionUseCase(this.auctionRepository)
        
        await auctionUseCase.deleteAuction(id)
    }
}