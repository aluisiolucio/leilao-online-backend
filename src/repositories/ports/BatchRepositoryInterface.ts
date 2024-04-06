import { Batch } from "@prisma/client"
import { BatchData } from "../../types/batch"
import { InscriptionData } from "../../types/inscription"

export interface IBatchRepository {
    createBatch(data: BatchData): Promise<Batch>
    getBatchById(id: string): Promise<Batch | null>
    getEnrolledBatchs(currentUser: string): Promise<Batch[]>
    updateBatch(id: string, data: BatchData): Promise<Batch>
    deleteBatch(id: string): Promise<void>
    batchExists(id: string): Promise<boolean>
    enrollUserInBatch(userId: string, batchId: string): Promise<InscriptionData>
    alreadyEnrolled(userId: string, batchId: string): Promise<boolean>
}
