import { Batch } from '@prisma/client'
import { prisma } from '../db/prisma'
import { IBatchRepository } from './ports/BatchRepositoryInterface'
import { HTTPError } from '../errors/httpError'
import { batchStatusEnum } from '../types/batchStatus'
import { formatTimezone } from '../utils/formatTimezone'
import { BatchData } from '../types/batch'
import { InscriptionData } from '../types/inscription'


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

    public async getEnrolledBatchs(currentUser: string): Promise<Batch[]> {
        const batchs = await prisma.batch.findMany({
            where: {
                Inscription: {
                    some: {
                        userId: currentUser
                    }
                }
            },
            include: {
                auction: true,
            },
            orderBy: {
                startDateTime: 'desc'
            }
        })

        return batchs
    }

    public async getBatchesWithRegistration(): Promise<object[]> {
        const batchs = await prisma.batch.findMany({
            select: {
                id: true,
                status: true,
                price: true,
                startDateTime: true
            },
            where: {
                Inscription: {
                    some: {}
                }
            },
            orderBy: {
                startDateTime: 'desc'
            }
        })

        return batchs
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

    public async changeStatus(id: string, status: string): Promise<void> {
        try {
            await prisma.batch.update({
                where: {
                    id
                },
                data: {
                    status
                }
            })
        } catch (error: any) {
            if(error.code === 'P2025') {
                throw new HTTPError(404, 'Lote não encontrado')
            }

            console.log(error)
            throw new HTTPError(400, 'Erro ao atualizar status do lote')
        }
    }

    public async hasParticipants(id: string): Promise<boolean> {
        const inscription = await prisma.inscription.findFirst({
            where: {
                batchId: id,
                confirmation: true
            }
        })

        return !!inscription
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

    public async confirmInscription(inscriptionId: string): Promise<InscriptionData> {
        try {
            const inscription = await prisma.inscription.update({
                where: {
                    id: inscriptionId
                },
                data: {
                    confirmation: true
                }
            })

            return inscription
        } catch (error: any) {
            if(error.code === 'P2025') {
                throw new HTTPError(404, 'Inscrição não encontrada')
            }

            console.log(error)
            throw new HTTPError(400, 'Erro ao confirmar inscrição')
        }
    }

    public async enrollUserInBatch(userId: string, batchId: string): Promise<InscriptionData> {
        const inscription = await prisma.inscription.create({
            data: {
                createdAt: formatTimezone(new Date()),
                updatedAt: formatTimezone(new Date()),
                userId,
                batchId
            }
        })

        return inscription       
    }

    public async getInscriptionById(userId: string, batchId: string): Promise<InscriptionData | null> {
        const inscription = await prisma.inscription.findFirst({
            where: {
                userId,
                batchId
            }
        })
     
        return inscription
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

    public async alreadyConfimation(inscriptionId: string): Promise<boolean> {
        const inscription = await prisma.inscription.findUnique({
            where: {
                id: inscriptionId
            }
        })

        return inscription?.confirmation || false
    }
}