import { Auction } from '@prisma/client'
import { prisma } from '../db/prisma'
import { IAuctionRepository } from './ports/AuctionRepositoryInterface'
import { HTTPError } from '../errors/httpError'

export class AuctionRepository implements IAuctionRepository {
    public async createAuction(title: string, description: string, startDateTime: Date, currentUser: string): Promise<object> {
        const auction = await prisma.auction.create({
            data: {
                title,
                description,
                startDateTime,
                ownerId: currentUser
            }
        })

        return { id: auction.id, title: auction.title, description: auction.description, startDateTime: auction.startDateTime }
    }

    public async getAuction(): Promise<object> {
        const auctions = await prisma.auction.findMany({
            select: {
                id: true,
                title: true,
                description: true,
                startDateTime: true,
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

    public async updateAuction(id: string, title: string, description: string, startDateTime: Date): Promise<object> {
        try {
            const auction = await prisma.auction.update({
                where: {
                    id
                },
                data: {
                    title,
                    description,
                    startDateTime
                }
            })

            return { id: auction.id }
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
}