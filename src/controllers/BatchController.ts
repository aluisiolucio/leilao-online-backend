import { z } from 'zod';
import { schemaError } from '../errors/schemaError';
import { HTTPError } from '../errors/httpError';
import { BatchRepository } from '../repositories/BatchRepository';
import { BatchUseCase } from '../useCases/BatchUseCase';
import { AuctionRepository } from '../repositories/AuctionRepository';
import { BatchData } from '../types/batch';
import { AuthRepository } from '../repositories/AuthRepository';

export class BatchController {
    private batchRepository: BatchRepository
    private auctionRepository: AuctionRepository
    private authRepository: AuthRepository

    constructor() {
        this.batchRepository = new BatchRepository()
        this.auctionRepository = new AuctionRepository()
        this.authRepository = new AuthRepository()
    }

    public async createBatch(requestBody: unknown) {
        const bacthSchema = z.object({
            auctionId: z.string(),
            title: z.string(),
            price: z.number(),
            code: z.number(),
            startDateTime: z.string(),
            specification: z.string(),
            imagesPath: z.array(z.string()).length(5)
        }).safeParse(requestBody)

        if (!bacthSchema.success) {
            schemaError(bacthSchema)
        } else {
            const batchData = bacthSchema.data as unknown as BatchData
    
            const batch = new BatchUseCase(this.batchRepository, this.auctionRepository)
            return await batch.createBatch(batchData)
        }
    }

    public async getBatchById(id: string, currentUser: string) {
        const batch = new BatchUseCase(this.batchRepository, this.auctionRepository, this.authRepository)
        return await batch.getBatchById(id, currentUser)
    }

    public async getEnrolledBatchs(currentUser: string) {
        const batch = new BatchUseCase(this.batchRepository, this.auctionRepository)
        return await batch.getEnrolledBatchs(currentUser)
    }

    public async updateBatch(id: string, requestBody: unknown) {
        const bacthSchema = z.object({
            auctionId: z.string(),
            title: z.string().optional(),
            price: z.number().optional(),
            code: z.number().optional(),
            startDateTime: z.string().optional(),
            specification: z.string().optional(),
            contact: z.object({
                name: z.string().optional(),
                phone: z.string().optional()
            }).optional()
        }).safeParse(requestBody)

        if (!bacthSchema.success) {
            schemaError(bacthSchema)
        } else {
            if (!bacthSchema.data.title && 
                !bacthSchema.data.price && 
                !bacthSchema.data.startDateTime && 
                !bacthSchema.data.specification && 
                !bacthSchema.data.contact) {
                throw new HTTPError(400, 'É necessário informar ao menos um campo para atualização')
            }
    
            const batchData = bacthSchema.data as unknown as BatchData
    
            const batch = new BatchUseCase(this.batchRepository, this.auctionRepository)
            return await batch.updateBatch(id, batchData)
        }
    }

    public async deleteBatch(id: string) {
        const batch = new BatchUseCase(this.batchRepository, this.auctionRepository)
        
        await batch.deleteBatch(id)
    }

    public async enrollUserInBatch(userId: string, requestBody: unknown) {
        const enrollSchema = z.object({
            batchId: z.string(),
            auctionId: z.string()
        }).safeParse(requestBody)

        if (!enrollSchema.success) {
            schemaError(enrollSchema)
        } else {
            const { batchId, auctionId } = enrollSchema.data
            const batch = new BatchUseCase(this.batchRepository, this.auctionRepository)
            
            return await batch.enrollUserInBatch(userId, batchId, auctionId)
        }
    }

    public async confirmInscription(userId: string, requestBody: unknown) {
        const confirmSchema = z.object({
            batchId: z.string()
        }).safeParse(requestBody)

        if (!confirmSchema.success) {
            schemaError(confirmSchema)
        } else {
            const { batchId } = confirmSchema.data
    
            const batch = new BatchUseCase(this.batchRepository, this.auctionRepository)
            return await batch.confirmInscription(batchId, userId)
        }
    }
}