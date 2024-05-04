import { z } from 'zod';
import { schemaError } from '../errors/schemaError';
import { AuctionRepository } from '../repositories/AuctionRepository';
import { AuctionUseCase } from '../useCases/AuctionUseCase';
import { HTTPError } from '../errors/httpError';
import { AuctionData, QueryParamsAuction } from '../types/auction';
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
            category: z.string(),
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
                imagesPath: z.array(z.string()).length(5),
            }))
        }).safeParse(requestBody)

        if (!createAuctionSchema.success) {
            schemaError(createAuctionSchema)
        } else {
            const auctionData = createAuctionSchema.data as unknown as AuctionData
    
            const auctionUseCase = new AuctionUseCase(this.auctionRepository, this.batchRepository)
            return await auctionUseCase.createAuction(auctionData, currentUser)
        }
    }

    public async getAuctions(params: QueryParamsAuction, currentUser: string) {
        const auctionUseCase = new AuctionUseCase(this.auctionRepository, this.batchRepository)
        return await auctionUseCase.getAuctions(params, currentUser)
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
        } else {
            const { title, description } = updateAuctionSchema.data
    
            if (!title && !description) {
                throw new HTTPError(400, 'É necessário informar ao menos um campo para atualização')
            }

            const auctionUseCase = new AuctionUseCase(this.auctionRepository, this.batchRepository)
            return await auctionUseCase.updateAuction(id, title || '', description || '')
        }
    }

    public async deleteAuction(id: string) {
        const auctionUseCase = new AuctionUseCase(this.auctionRepository, this.batchRepository)
        
        await auctionUseCase.deleteAuction(id)
    }
}