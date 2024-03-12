import { Batch } from "@prisma/client"
import { BatchData } from "../../types/batch"

export interface IBatchRepository {
    createBatch(data: BatchData): Promise<Batch>
    getBatchById(id: string): Promise<Batch | null>
    updateBatch(id: string, data: BatchData): Promise<Batch>
    deleteBatch(id: string): Promise<void>
    batchExists(id: string): Promise<boolean>
    enrollUserInBatch(userId: string, batchId: string): Promise<void>
    alreadyEnrolled(userId: string, batchId: string): Promise<boolean>
}
