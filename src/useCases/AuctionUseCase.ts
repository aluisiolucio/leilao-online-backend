import { HTTPError } from '../errors/httpError'
import { IAuctionRepository } from '../repositories/ports/AuctionRepositoryInterface'
import { IBatchRepository } from '../repositories/ports/BatchRepositoryInterface'
import { AuctionData, QueryParamsAuction } from '../types/auction'
import { BatchData } from '../types/batch'
import { verifyBatch } from '../utils/verifyBatch'

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

    public async getAuctions(params: QueryParamsAuction, currentUser: string) {
        const auctions = await this.auctionRepository.getAuctions(params, currentUser)

        let auctionsList: any[] = []
        auctions.forEach((auction: any) => {
            let batchsList: any[] = []
            let imagesPath: string[] = []

            auction.Batch.forEach( async (batch: any) => {
                if (batch.imagePath1 !== '') {
                    imagesPath.push(batch.imagePath1)
                }
                if (batch.imagePath2 !== '') {
                    imagesPath.push(batch.imagePath2)
                }
                if (batch.imagePath3 !== '') {
                    imagesPath.push(batch.imagePath3)
                }
                if (batch.imagePath4 !== '') {
                    imagesPath.push(batch.imagePath4)
                }
                if (batch.imagePath5 !== '') {
                    imagesPath.push(batch.imagePath5)
                }

                await verifyBatch(batch, this.batchRepository);

                batchsList.push({
                    id: batch.id,
                    title: batch.title,
                    code: batch.code,
                    price: batch.price,
                    status: batch.status,
                    startDateTime: batch.startDateTime,
                    imagesPath: imagesPath
                })

                imagesPath = []
            })

            auctionsList.push({
                id: auction.id,
                title: auction.title,
                description: auction.description,
                ownerId: auction.ownerId,
                imagePath: auction.imagePath,
                category: auction.category,
                contact: {
                    name: auction.contactName,
                    phone: auction.contactPhone
                },
                batchs: batchsList
            })
        })

        return auctionsList
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
            if (batch.imagePath1 !== '') {
                imagesPath.push(batch.imagePath1)
            }
            if (batch.imagePath2 !== '') {
                imagesPath.push(batch.imagePath2)
            }
            if (batch.imagePath3 !== '') {
                imagesPath.push(batch.imagePath3)
            }
            if (batch.imagePath4 !== '') {
                imagesPath.push(batch.imagePath4)
            }
            if (batch.imagePath5 !== '') {
                imagesPath.push(batch.imagePath5)
            }

            await verifyBatch(batch, this.batchRepository);

            batchsList.push({
                id: batch.id,
                title: batch.title,
                code: batch.code,
                price: batch.price,
                status: batch.status,
                startDateTime: batch.startDateTime,
                imagesPath: imagesPath
            })

            imagesPath = []
        }

        return {
            id: auction.id,
            title: auction.title,
            description: auction.description,
            ownerId: auction.ownerId,
            isOwner: isOwner,
            imagePath: auction.imagePath,
            category: auction.category,
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