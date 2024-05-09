import { IBatchRepository } from "../repositories/ports/BatchRepositoryInterface";
import { batchStatusEnum } from "../types/batchStatus";


export async function verifyBatch(batch: any, batchRepository: IBatchRepository) {
    const currentDateTime = new Date();
    currentDateTime.setHours(currentDateTime.getHours() - 3);
  
    const openingTimeOrignal = new Date(batch.startDateTime);
    openingTimeOrignal.setHours(openingTimeOrignal.getHours() - 3);
  
    if (currentDateTime > openingTimeOrignal && batch.status !== 'Fechado') {
      const hasParticipantsConfirmed = await batchRepository.hasParticipants(batch.id);
  
      if (!hasParticipantsConfirmed) {
        await batchRepository.changeStatus(batch.id, batchStatusEnum.CLOSED);
      }
    }
}