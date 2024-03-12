import { Batch } from '@prisma/client'
import { prisma } from '../db/prisma'
import { IBatchRepository } from './ports/BatchRepositoryInterface'
import { HTTPError } from '../errors/httpError'
import { BatchData } from '../types/batch'
import { batchStatusEnum } from '../types/batchStatus'


export class BatchRepository implements IBatchRepository {
    public async createBatch(data: BatchData): Promise<Batch> {
        const batch = await prisma.batch.create({
            data: {
                auctionId: data.auctionId,
                title: data.title,
                price: data.price,
                startDateTime: data.startDateTime,
                especification: data.especification,
                contactName: data.contact.name,
                contactPhone: data.contact.phone,
                number: Math.floor(Math.random() * 1000000) + 1,
                status: batchStatusEnum.OPEN
            }
        })

        return batch
    }

    public async getBatchById(id: string): Promise<Batch | null> {
        const batch = await prisma.batch.findUnique({
            where: {
                id
            }
        })

        return batch
    }
}