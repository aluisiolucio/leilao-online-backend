import { HTTPError } from '../errors/httpError'
import { IAuctionRepository } from '../repositories/ports/AuctionRepositoryInterface'

type QueryAuction = {
    dataInicial?: string
    dataFinal?: string
    limite?: number
}
export class AuctionUseCase {
  constructor(private readonly auctionRepository: IAuctionRepository) {}

    public async createAuction(title: string, description: string, imagePath: string, currentUser: string) {
        const auction = await this.auctionRepository.createAuction(title, description, imagePath, currentUser)

        return {
            id: auction.id,
            title: auction.title,
            description: auction.description
        }
    }

    public async getAuction(query: QueryAuction, currentUser: string) {
        const dataInicial = query.dataInicial ? new Date(query.dataInicial) : null
        const dataFinal = query.dataFinal ? new Date(query.dataFinal) : null
        const limite = Number(query.limite) || -1

        if (dataInicial && dataFinal && dataFinal > dataInicial) {
            return await this.auctionRepository.getAuctionsByQuery(dataInicial, dataFinal, limite, currentUser)
        }

        return await this.auctionRepository.getAuctions(limite, currentUser)
    }

    public async getAuctionById(id: string, currentUser: string) {
        const auction = await this.auctionRepository.getAuctionById(id)

        if (!auction) {
            throw new HTTPError(404, 'Leilão não encontrado')
        }

        const isOwner = auction.ownerId === currentUser

        let batchsList = []
        for (let batch of auction.Batch) {
            batchsList.push({
                id: batch.id,
                title: batch.title,
                number: batch.number
            })
        }

        return {
            id: auction.id,
            title: auction.title,
            description: auction.description,
            ownerId: auction.ownerId,
            isOwner: isOwner,
            batchs: batchsList
        }
    }

    public async updateAuction(id: string, title: string, description: string) {
        const auction = await this.auctionRepository.updateAuction(id, title, description)

        return {
            id: auction.id
        }
    }

    public async deleteAuction(id: string) {
        await this.auctionRepository.deleteAuction(id)
    }
}