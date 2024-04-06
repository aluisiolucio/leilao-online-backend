import { z } from 'zod';
import { schemaError } from '../errors/schemaError';
import { AuctionRepository } from '../repositories/AuctionRepository';
import { AuctionUseCase } from '../useCases/AuctionUseCase';
import { HTTPError } from '../errors/httpError';
import { AuctionData } from '../types/auction';
import { BatchRepository } from '../repositories/BatchRepository';

export class AuctionController {
    private auctionRepository: AuctionRepository
    private batchRepository: BatchRepository

    constructor() {
        this.auctionRepository = new AuctionRepository()
        this.batchRepository = new BatchRepository()
    }

    public async createAuction(requestBody: unknown, currentUser: string) {
        const createAuctionSchema = z.object({
            title: z.string(),
            description: z.string(),
            imagePath: z.string(),
            contact: z.object({
                name: z.string(),
                phone: z.string()
            }),
            batchs: z.array(z.object({
                title: z.string(),
                price: z.number(),
                code: z.number(),
                startDateTime: z.string(),
                specification: z.string(),
                imagesPath: z.array(z.string()),
            }))
        }).safeParse(requestBody)

        if (!createAuctionSchema.success) {
            schemaError(createAuctionSchema)
        }

        const auctionData = createAuctionSchema.data as AuctionData

        const auctionUseCase = new AuctionUseCase(this.auctionRepository, this.batchRepository)
        return await auctionUseCase.createAuction(auctionData, currentUser)
    }

    public async getAuction(query: unknown, currentUser: string) {
        const auctionUseCase = new AuctionUseCase(this.auctionRepository, this.batchRepository)
        return await auctionUseCase.getAuction(query, currentUser)
    }

    public async getAuctionById(id: string, currentUser: string) {
        const auctionUseCase = new AuctionUseCase(this.auctionRepository, this.batchRepository)
        return await auctionUseCase.getAuctionById(id, currentUser)
    }

    public async updateAuction(id: string, requestBody: unknown) {
        const updateAuctionSchema = z.object({
            title: z.string().optional(),
            description: z.string().optional()
        }).safeParse(requestBody)

        if (!updateAuctionSchema.success) {
            schemaError(updateAuctionSchema)
        }

        const { title, description } = updateAuctionSchema.data

        if (!title && !description) {
            throw new HTTPError(400, 'É necessário informar ao menos um campo para atualização')
        }

        const auctionUseCase = new AuctionUseCase(this.auctionRepository, this.batchRepository)
        return await auctionUseCase.updateAuction(id, title, description)
    }

    public async deleteAuction(id: string) {
        const auctionUseCase = new AuctionUseCase(this.auctionRepository, this.batchRepository)
        
        await auctionUseCase.deleteAuction(id)
    }
}