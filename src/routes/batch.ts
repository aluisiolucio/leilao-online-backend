import { FastifyInstance, FastifyRequest } from 'fastify';
import { BatchController } from '../controllers/BatchController';

interface CustomRequest extends FastifyRequest {
    user: {
        id: string
    }
    params: {
        id: string
    }
}

export async function postBatch(app: FastifyInstance) {
    app.post('/', async (request, reply) => {
        const controller = new BatchController()
        
        const batch = await controller.createBatch(request.body)

        return reply.status(201).send(batch)
    })
}

export async function getBatchById(app: FastifyInstance) {
    app.get('/:id', async (request, reply) => {
        const controller = new BatchController()
        
        const batch = await controller.getBatchById((request as CustomRequest).params.id, (request as CustomRequest).user.id)

        return reply.status(200).send(batch)
    })
}

export async function getEnrolledBatchs(app: FastifyInstance) {
    app.get('/enrolled', async (request, reply) => {
        const controller = new BatchController()
        
        const batchs = await controller.getEnrolledBatchs((request as CustomRequest).user.id)

        return reply.status(200).send(batchs)
    })
}

export async function putBatch(app: FastifyInstance) {
    app.put('/:id', async (request, reply) => {
        const controller = new BatchController()
        
        const batch = await controller.updateBatch((request as CustomRequest).params.id, request.body)

        return reply.status(200).send(batch)
    })
}

export async function deleteBatch(app: FastifyInstance) {
    app.delete('/:id', async (request, reply) => {
        const controller = new BatchController()
        
        await controller.deleteBatch((request as CustomRequest).params.id)

        return reply.status(204).send()
    })
}

export async function enrollUserInBatch(app: FastifyInstance) {
    app.post('/enroll', async (request, reply) => {
        const controller = new BatchController()
        
        return await controller.enrollUserInBatch((request as CustomRequest).user.id, request.body)
    })
}

export async function confirmInscription(app: FastifyInstance) {
    app.patch('/confirm', async (request, reply) => {
        const controller = new BatchController()
        
        return await controller.confirmInscription((request as CustomRequest).user.id, request.body)
    })
}
