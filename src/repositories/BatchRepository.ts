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
                    especification: data.especification,
                    contactName: data.contact.name,
                    contactPhone: data.contact.phone
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