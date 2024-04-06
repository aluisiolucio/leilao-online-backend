import { HTTPError } from '../errors/httpError'
import { IAuctionRepository } from '../repositories/ports/AuctionRepositoryInterface'
import { IBatchRepository } from '../repositories/ports/BatchRepositoryInterface'
import { AuctionData } from '../types/auction'
import { BatchData } from '../types/batch'

type QueryAuction = {
    dataInicial?: string
    dataFinal?: string
    limite?: number
    myAuctions?: boolean
}
export class AuctionUseCase {
  constructor(private readonly auctionRepository: IAuctionRepository, private readonly batchRepository: IBatchRepository) {}

    public async createAuction(auctionData: AuctionData, currentUser: string) {
        const auction = await this.auctionRepository.createAuction(auctionData, currentUser)

        auctionData.batchs.forEach((batch) => {
            const batchData: BatchData = {
                auctionId: auction.id,
                title: batch.title,
                price: batch.price,
                code: batch.code,
                startDateTime: new Date(batch.startDateTime),
                specification: batch.specification,
                imagesPath: batch.imagesPath,
            }

            this.batchRepository.createBatch(batchData)
        })

        return {
            id: auction.id
        }
    }

    public async getAuction(query: QueryAuction, currentUser: string) {
        const dataInicial = query.dataInicial ? new Date(query.dataInicial) : null
        const dataFinal = query.dataFinal ? new Date(query.dataFinal) : null
        const limite = Number(query.limite) || -1

        if (dataInicial && dataFinal && dataFinal > dataInicial) {
            return await this.auctionRepository.getAuctionsByQuery(dataInicial, dataFinal, limite, currentUser)
        } else if (query.myAuctions) {
            return await this.auctionRepository.getAuctionsByUser(currentUser, limite)
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
        let imagesPath = []
        for (let batch of auction.Batch) {
            imagesPath.push(batch.imagePath1)
            imagesPath.push(batch.imagePath2)
            imagesPath.push(batch.imagePath3)
            imagesPath.push(batch.imagePath4)
            imagesPath.push(batch.imagePath5)

            batchsList.push({
                id: batch.id,
                title: batch.title,
                code: batch.code,
                price: batch.price,
                status: batch.status,
                startDateTime: batch.startDateTime,
                imagesPath: imagesPath
            })
        }

        return {
            id: auction.id,
            title: auction.title,
            description: auction.description,
            ownerId: auction.ownerId,
            isOwner: isOwner,
            imagePath: auction.imagePath,
            contact: {
                name: auction.contactName,
                phone: auction.contactPhone
            },
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