import { Auction } from '@prisma/client'
import { prisma } from '../db/prisma'
import { IAuctionRepository } from './ports/AuctionRepositoryInterface'
import { HTTPError } from '../errors/httpError'

export class AuctionRepository implements IAuctionRepository {
    public async createAuction(title: string, description: string, currentUser: string): Promise<Auction> {
        const auction = await prisma.auction.create({
            data: {
                title,
                description,
                ownerId: currentUser
            }
        })

        return auction
    }

    public async getAuction(): Promise<object> {
        const auctions = await prisma.auction.findMany({
            select: {
                id: true,
                title: true,
                description: true,
                ownerId: true
            }
        })

        return auctions
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