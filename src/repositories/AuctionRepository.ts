import { Auction, Prisma } from '@prisma/client'
import { prisma } from '../db/prisma'
import { IAuctionRepository } from './ports/AuctionRepositoryInterface'
import { HTTPError } from '../errors/httpError'
import { formatTimezone } from '../utils/formatTimezone'
import { AuctionData, QueryParamsAuction } from '../types/auction'

export class AuctionRepository implements IAuctionRepository {
    public async createAuction(auctionData: AuctionData, currentUser: string): Promise<Auction> {
        const auction = await prisma.auction.create({
            data: {
                createdAt: formatTimezone(new Date()),
                updatedAt: formatTimezone(new Date()),
                title: auctionData.title,
                description: auctionData.description,
                imagePath: auctionData.imagePath,
                category: auctionData.category,
                contactName: auctionData.contact.name,
                contactPhone: auctionData.contact.phone,
                ownerId: currentUser
            }
        })

        return auction
    }

    public async getAuctions(params: QueryParamsAuction, currentUser: string): Promise<Auction[]> {
        const { dataInicial, dataFinal, limite, category, myAuctions } = params;
    
        let where: Prisma.AuctionWhereInput = {};
            
        if (dataInicial && dataFinal && dataFinal >= dataInicial) {
            where.createdAt = {
                gte: dataInicial + 'T00:00:00.000Z',
                lte: dataFinal + 'T23:59:59.999Z'
            };
        }

        if (category) {
            where.category = {
                contains: category
            };
        }
    
        let auctions = await prisma.auction.findMany({
            where,
            take: limite ? Number(limite) : undefined,
            include: {
                Batch: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        const isMyAuctions = myAuctions === 'true';
    
        if (isMyAuctions) {
            auctions = auctions.filter(auction => auction.ownerId == currentUser);
        } else {
            auctions = auctions.filter(auction => auction.ownerId !== currentUser);
        }

        return auctions;
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