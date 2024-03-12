import { z } from 'zod';
import { schemaError } from '../errors/schemaError';
import { HTTPError } from '../errors/httpError';
import { BatchRepository } from '../repositories/BatchRepository';
import { BatchData } from '../types/batch';
import { BatchUseCase } from '../useCases/BatchUseCase';

export class BatchController {
    private batchRepository: BatchRepository

    constructor() {
        this.batchRepository = new BatchRepository()
    }

    public async createBatch(requestBody: unknown) {
        const bacthSchema = z.object({
            auctionId: z.string(),
            title: z.string(),
            price: z.number(),
            startDateTime: z.string(),
            especification: z.string(),
            contact: z.object({
                name: z.string(),
                phone: z.string()
            })
        }).safeParse(requestBody)

        if (!bacthSchema.success) {
            schemaError(bacthSchema)
        }

        const batchData = bacthSchema.data as BatchData

        const batch = new BatchUseCase(this.batchRepository)
        return await batch.createBatch(batchData)
    }

    public async getBatchById(id: string) {
        const batch = new BatchUseCase(this.batchRepository)
        return await batch.getBatchById(id)
    }

    public async updateBatch(id: string, requestBody: unknown) {
        const bacthSchema = z.object({
            auctionId: z.string(),
            title: z.string().optional(),
            price: z.number().optional(),
            startDateTime: z.string().optional(),
            especification: z.string().optional(),
            contact: z.object({
                name: z.string().optional(),
                phone: z.string().optional()
            }).optional()
        }).safeParse(requestBody)

        if (!bacthSchema.success) {
            schemaError(bacthSchema)
        }

        if (!bacthSchema.data.title && 
            !bacthSchema.data.price && 
            !bacthSchema.data.startDateTime && 
            !bacthSchema.data.especification && 
            !bacthSchema.data.contact) {
            throw new HTTPError(400, 'É necessário informar ao menos um campo para atualização')
        }

        const batchData = bacthSchema.data as BatchData

        const batch = new BatchUseCase(this.batchRepository)
        return await batch.updateBatch(id, batchData)
    }

    public async deleteBatch(id: string) {
        const batch = new BatchUseCase(this.batchRepository)
        
        await batch.deleteBatch(id)
    }
}