import { HTTPError } from "../errors/httpError";
import { IBatchRepository } from "../repositories/ports/BatchRepositoryInterface";
import { BatchData } from "../types/batch";

export class BatchUseCase {
  constructor(private readonly batchRepository: IBatchRepository) {}

  public async createBatch(data: BatchData): Promise<object> {
    const batch = await this.batchRepository.createBatch(data)

    return { 
        id: batch.id,
        auctionId: batch.auctionId,
        title: batch.title, 
        price: batch.price, 
        startDateTime: batch.startDateTime, 
        especification: batch.especification,
        number: batch.number,
        status: batch.status, 
        contact: { 
            name: batch.contactName, 
            phone: batch.contactPhone 
        } 
    }
  }

  public async getBatchById(id: string) {
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
        especification: batch.especification,
        number: batch.number,
        status: batch.status, 
        contact: { 
            name: batch.contactName, 
            phone: batch.contactPhone 
        } 
    }
  }
}