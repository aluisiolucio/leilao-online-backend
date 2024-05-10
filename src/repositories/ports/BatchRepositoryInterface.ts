import { Batch } from "@prisma/client"
import { BatchData } from "../../types/batch"
import { InscriptionData } from "../../types/inscription"

export interface IBatchRepository {
    createBatch(data: BatchData): Promise<Batch>
    getBatchById(id: string): Promise<Batch | null>
    getEnrolledBatchs(currentUser: string): Promise<any>
    getBatchesWithRegistration(): Promise<object[]>
    updateBatch(id: string, data: BatchData): Promise<Batch>
    changeStatus(id: string, status: string): Promise<void>
    hasParticipants(id: string): Promise<boolean>
    deleteBatch(id: string): Promise<void>
    batchExists(id: string): Promise<boolean>
    confirmInscription(inscriptionId: string): Promise<InscriptionData>
    enrollUserInBatch(userId: string, batchId: string): Promise<InscriptionData>
    getInscriptionById(userId: string, batchId: string): Promise<InscriptionData | null>
    alreadyEnrolled(userId: string, batchId: string): Promise<boolean>
    alreadyConfimation(inscriptionId: string): Promise<boolean>
    saveWinner(batchId: string, winnerId: string, closingPrice: number): Promise<void>
}
