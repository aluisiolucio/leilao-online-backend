import { Auction } from '@prisma/client'
import { prisma } from '../db/prisma'
import { IAuctionRepository } from './ports/AuctionRepositoryInterface'
import { HTTPError } from '../errors/httpError'
import { formatTimezone } from '../utils/formatTimezone'
import { AuctionData } from '../types/auction'

export class AuctionRepository implements IAuctionRepository {
    public async createAuction(auctionData: AuctionData, currentUser: string): Promise<Auction> {
        const auction = await prisma.auction.create({
            data: {
                createdAt: formatTimezone(new Date()),
                updatedAt: formatTimezone(new Date()),
                title: auctionData.title,
                description: auctionData.description,
                imagePath: auctionData.imagePath,
                contactName: auctionData.contact.name,
                contactPhone: auctionData.contact.phone,
                ownerId: currentUser
            }
        })

        return auction
    }

    public async getAuctions(limite: number, currentUser: string): Promise<object> {
        let auctions
        
        if (limite !== -1) {
            auctions = await prisma.auction.findMany({
                select: {
                    id: true,
                    title: true,
                    imagePath: true,
                    ownerId: true
                },
                where: {
                    ownerId: {
                        not: currentUser
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                },
                take: limite
            })
        } else {
            auctions = await prisma.auction.findMany({
                select: {
                    id: true,
                    title: true,
                    imagePath: true,
                    ownerId: true
                },
                where: {
                    ownerId: {
                        not: currentUser
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            })
        }

        return auctions
    }

    public async getAuctionsByQuery(dataInicial: Date, dataFinal: Date, limite: number, currentUser: string): Promise<object> {        
        let auctions
        
        if (limite !== -1) {
            auctions = await prisma.auction.findMany({
                select: {
                    id: true,
                    title: true,
                    description: true,
                    imagePath: true,
                    ownerId: true
                },
                where: {
                    ownerId: {
                        not: currentUser
                    },
                    createdAt: {
                        gte: dataInicial,
                        lte: dataFinal 
                    }
                },
                orderBy: {
                    createdAt: 'asc'
                },
                take: limite
            })
        } else {
            auctions = await prisma.auction.findMany({
                select: {
                    id: true,
                    title: true,
                    description: true,
                    imagePath: true,
                    ownerId: true
                },
                where: {
                    ownerId: {
                        not: currentUser
                    },
                    createdAt: {
                        gte: dataInicial,
                        lte: dataFinal
                    }
                },
                orderBy: {
                    createdAt: 'asc'
                }
            })
        }

        return auctions
    }

    public async getAuctionsByUser(currentUser: string, limite: number): Promise<object> {
        let auctions
        
        if (limite !== -1) {
            auctions = await prisma.auction.findMany({
                where: {
                    ownerId: currentUser
                },
                orderBy: {
                    createdAt: 'desc'
                },
                take: limite,
                include: {
                    Batch: true
                }                 
            })
        } else {
            auctions = await prisma.auction.findMany({
                where: {
                    ownerId: currentUser
                },
                orderBy: {
                    createdAt: 'desc'
                },
                include: {
                    Batch: true
                }
            })
        }

        auctions = auctions.map(auction => ({
            ...auction,
            batchCount: auction.Batch.length
        }));

        const auctionsList = auctions.map(auction => ({
            id: auction.id,
            title: auction.title,
            batchCount: auction.batchCount
        }))

        return auctionsList
    }

    public async getAuctionById(id: string): Promise<Auction | null> {
        const auction = await prisma.auction.findUnique({
            where: {
                id
            },
            include: { Batch: true }
        })

        return auction
    }

    public async updateAuction(id: string, title: string, description: string): Promise<Auction> {
        try {
            const auction = await prisma.auction.update({
                where: {
                    id
                },
                data: {
                    title,
                    description
                }
            })

            return auction
        } catch (error: any) {
            if(error.code === 'P2025') {
                throw new HTTPError(404, 'Leilão não encontrado')
            }

            console.log(error)
            throw new HTTPError(400, 'Erro ao atualizar leilão')
        }
    }

    public async deleteAuction(id: string): Promise<void> {
        try {
            await prisma.auction.delete({
                where: {
                    id
                }
            })   
        } catch (error: any) {
            if(error.code === 'P2025') {
                throw new HTTPError(404, 'Leilão não encontrado')
            }

            console.log(error)
            throw new HTTPError(400, 'Erro ao excluir leilão')
            
        }
    }

    public async ownerAuction(id: string, currentUser: string): Promise<boolean> {
        const auction = await prisma.auction.findFirst({
            where: {
                id,
                ownerId: currentUser
            }
        })

        return !!auction
    }
}