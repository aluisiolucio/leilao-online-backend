import { Batch } from "@prisma/client"
import { BatchData } from "../../types/batch"

export interface IBatchRepository {
    createBatch(data: BatchData): Promise<Batch>
    getBatchById(id: string): Promise<Batch | null>
}
