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
}