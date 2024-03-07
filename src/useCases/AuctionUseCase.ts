import { HTTPError } from '../errors/httpError'
import { IAuctionRepository } from '../repositories/ports/AuctionRepositoryInterface'

export class AuctionUseCase {
  constructor(private readonly auctionRepository: IAuctionRepository) {}

    public async createAuction(title: string, description: string, startDateTime: Date, currentUser: string) {
        return await this.auctionRepository.createAuction(title, description, startDateTime, currentUser)
    }

    public async getAuction() {
        return await this.auctionRepository.getAuction()
    }

    public async getAuctionById(id: string) {
        const auction = await this.auctionRepository.getAuctionById(id)

        if (!auction) {
            throw new HTTPError(404, 'Leilão não encontrado')
        }

        return {
            id: auction.id,
            title: auction.title,
            description: auction.description,
            startDateTime: auction.startDateTime,
            ownerId: auction.ownerId,
            batchs: auction.Batch
        }
    }

    public async updateAuction(id: string, title: string, description: string, startDateTime: Date) {
        return await this.auctionRepository.updateAuction(id, title, description, startDateTime)
    }

    public async deleteAuction(id: string) {
        await this.auctionRepository.deleteAuction(id)
    }
}