import { Batch } from '@prisma/client'
import { prisma } from '../db/prisma'
import { IBatchRepository } from './ports/BatchRepositoryInterface'
import { HTTPError } from '../errors/httpError'
import { batchStatusEnum } from '../types/batchStatus'
import { formatTimezone } from '../utils/formatTimezone'
import { BatchData } from '../types/batch'


export class BatchRepository implements IBatchRepository {
    public async createBatch(data: BatchData): Promise<Batch> {
        const batch = await prisma.batch.create({
            data: {
                createdAt: formatTimezone(new Date()),
                updatedAt: formatTimezone(new Date()),
                auctionId: data.auctionId || '',
                title: data.title,
                status: batchStatusEnum.OPEN,
                code: data.code,
                price: data.price,
                startDateTime: data.startDateTime,
                specification: data.specification,
                imagePath1: data.imagesPath[0],
                imagePath2: data.imagesPath[1],
                imagePath3: data.imagesPath[2],
                imagePath4: data.imagesPath[3],
                imagePath5: data.imagesPath[4],
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

    public async updateBatch(id: string, data: BatchData): Promise<Batch> {
        try {
            const batch = await prisma.batch.update({
                where: {
                    id
                },
                data: {
                    title: data.title,
                    price: data.price,
                    startDateTime: data.startDateTime,
                    specification: data.specification,
                }
            })

            return batch
        } catch (error: any) {
            if(error.code === 'P2025') {
                throw new HTTPError(404, 'Leilão não encontrado')
            }

            console.log(error)
            throw new HTTPError(400, 'Erro ao atualizar leilão')
        }
    }

    public async deleteBatch(id: string): Promise<void> {
        try {
            await prisma.batch.delete({
                where: {
                    id
                }
            })
        } catch (error: any) {
            if(error.code === 'P2025') {
                throw new HTTPError(404, 'Lote não encontrado')
            }

            console.log(error)
            throw new HTTPError(400, 'Erro ao deletar lote')
        }
    }

    public async batchExists(id: string): Promise<boolean> {
        const batch = await prisma.batch.findUnique({
            where: {
                id
            }
        })

        return !!batch
    }

    public async enrollUserInBatch(userId: string, batchId: string): Promise<void> {
        await prisma.inscription.create({
            data: {
                createdAt: formatTimezone(new Date()),
                updatedAt: formatTimezone(new Date()),
                userId,
                batchId
            }
        })
    }

    public async alreadyEnrolled(userId: string, batchId: string): Promise<boolean> {
        const inscription = await prisma.inscription.findFirst({
            where: {
                userId,
                batchId
            }
        })

        return !!inscription
    }
}