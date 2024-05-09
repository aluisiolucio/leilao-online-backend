import { HTTPError } from "../errors/httpError";
import { IBatchRepository } from "../repositories/ports/BatchRepositoryInterface";
import { IAuctionRepository } from "../repositories/ports/AuctionRepositoryInterface";
import { BatchData } from "../types/batch";
import { batchStatusEnum } from "../types/batchStatus";
import { verifyBatch } from "../utils/verifyBatch";

export class BatchUseCase {
  constructor(private readonly batchRepository: IBatchRepository, private readonly auctionRepository: IAuctionRepository) {}

  public async createBatch(data: BatchData): Promise<object> {
    const batch = await this.batchRepository.createBatch(data)

    return { 
        id: batch.id
    }
  }

  public async getBatchById(id: string, currentUser: string) {
    const batch = await this.batchRepository.getBatchById(id)

    if (!batch) {
        throw new HTTPError(404, 'Lote não encontrado')
    }
  
    const inscription = await this.batchRepository.getInscriptionById(currentUser, batch.id)

    let isConfirmation = false
    if (inscription) {
      isConfirmation = await this.batchRepository.alreadyConfimation(inscription.id)
    }

    await verifyBatch(batch, this.batchRepository);

    const imagesList = []

    if (batch.imagePath1) {
        imagesList.push(batch.imagePath1)
    }
    if (batch.imagePath2) {
        imagesList.push(batch.imagePath2)
    }
    if (batch.imagePath3) {
        imagesList.push(batch.imagePath3)
    }
    if (batch.imagePath4) {
        imagesList.push(batch.imagePath4)
    }
    if (batch.imagePath5) {
        imagesList.push(batch.imagePath5)
    }

    return {
        id: batch.id,
        auctionId: batch.auctionId,
        title: batch.title, 
        price: batch.price, 
        startDateTime: batch.startDateTime, 
        specification: batch.specification,
        code: batch.code,
        status: batch.status,
        isEnrolled: await this.batchRepository.alreadyEnrolled(currentUser, batch.id),
        isConfirmation: isConfirmation,
        images: imagesList
    }
  }

  public async getEnrolledBatchs(currentUser: string) {
    const batchs = await this.batchRepository.getEnrolledBatchs(currentUser)

    let enrolledBatchs: any = []
    batchs.map((batch: any) => {
        enrolledBatchs.push({
            id: batch.id,
            auctionId: batch.auctionId,
            auctionTitle: batch.auction.title,
            title: batch.title, 
            price: batch.price, 
            startDateTime: batch.startDateTime,
            code: batch.code,
            status: batch.status,
        })
    })

    return enrolledBatchs
  }

  public async updateBatch(id: string, data: BatchData) {
    const batch = await this.batchRepository.updateBatch(id, data)

    return {
        id: batch.id
    }
  }

  public async deleteBatch(id: string) {
    await this.batchRepository.deleteBatch(id)
  }

  public async confirmInscription(batchId: string, userId: string) {
    const batch = await this.batchRepository.getBatchById(batchId)

    if (!batch) {
        throw new HTTPError(404, 'Lote não encontrado')
    }

    if (batch?.status !== batchStatusEnum.WAITING_FOR_PARTICIPANTS) {
        throw new HTTPError(404, 'Lote não está aberto para confirmação de inscrição. Aguarde o período para confirmação de inscrição')
    }

    const inscription = await this.batchRepository.getInscriptionById(userId, batchId)

    if (!inscription) {
        throw new HTTPError(404, 'Inscrição não encontrada')
    }

    return await this.batchRepository.confirmInscription(inscription.id)
  }

  public async enrollUserInBatch(userId: string, batchId: string, auctionId: string) {
    if (!await this.batchRepository.batchExists(batchId)) {
        throw new HTTPError(404, 'Lote não encontrado')
    }

    if (await this.auctionRepository.ownerAuction(auctionId, userId)) {
        throw new HTTPError(400, 'Usuário não pode se inscrever em lote de seu próprio leilão')
    }

    if (await this.batchRepository.alreadyEnrolled(userId, batchId)) {
        throw new HTTPError(400, 'Usuário já inscrito no lote')
    }

    const inscription = await this.batchRepository.enrollUserInBatch(userId, batchId)

    return {
        id: inscription.id
    }
  }
}
