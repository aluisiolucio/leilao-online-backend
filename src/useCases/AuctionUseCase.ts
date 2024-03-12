import { HTTPError } from '../errors/httpError'
import { IAuctionRepository } from '../repositories/ports/AuctionRepositoryInterface'

export class AuctionUseCase {
  constructor(private readonly auctionRepository: IAuctionRepository) {}

    public async createAuction(title: string, description: string, currentUser: string) {
        const auction = await this.auctionRepository.createAuction(title, description, currentUser)

        return {
            id: auction.id,
            title: auction.title,
            description: auction.description
        }
    }

    public async getAuction() {
        return await this.auctionRepository.getAuction()
    }

    public async getAuctionById(id: string) {
        const auction = await this.auctionRepository.getAuctionById(id)

        if (!auction) {
            throw new HTTPError(404, 'Leilão não encontrado')
        }

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