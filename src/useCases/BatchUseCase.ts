import { HTTPError } from "../errors/httpError";
import { IBatchRepository } from "../repositories/ports/BatchRepositoryInterface";
import { IAuctionRepository } from "../repositories/ports/AuctionRepositoryInterface";
import { BatchData } from "../types/batch";

export class BatchUseCase {
  constructor(private readonly batchRepository: IBatchRepository, private readonly auctionRepository: IAuctionRepository) {}

  public async createBatch(data: BatchData): Promise<object> {
    const batch = await this.batchRepository.createBatch(data)

    return { 
        id: batch.id
    }
  }

  public async getBatchById(id: string, correntUser: string) {
    const batch = await this.batchRepository.getBatchById(id)

    if (!batch) {
        throw new HTTPError(404, 'Lote não encontrado')
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
        isEnrolled: await this.batchRepository.alreadyEnrolled(correntUser, batch.id),
        images: [batch.imagePath1, batch.imagePath2, batch.imagePath3, batch.imagePath4, batch.imagePath5],
    }
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