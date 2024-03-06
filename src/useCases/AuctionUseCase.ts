import { IAuctionRepository } from '../repositories/ports/AuctionRepositoryInterface'

export class AuctionUseCase {
  constructor(private readonly auctionRepository: IAuctionRepository) {}

    public async createAuction(title: string, description: string, startDateTime: Date, currentUser: string) {
        return await this.auctionRepository.createAuction(title, description, startDateTime, currentUser)
    }

    public async getAuction() {
        return await this.auctionRepository.getAuction()
    }
}