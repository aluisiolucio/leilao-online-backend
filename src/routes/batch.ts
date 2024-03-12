import { FastifyInstance } from 'fastify';
import { BatchController } from '../controllers/BatchController';


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
        
        const batch = await controller.getBatchById(request.params.id)

        return reply.status(200).send(batch)
    })
}

export async function putBatch(app: FastifyInstance) {
    app.put('/:id', async (request, reply) => {
        const controller = new BatchController()
        
        const batch = await controller.updateBatch(request.params.id, request.body)

        return reply.status(200).send(batch)
    })
}

export async function deleteBatch(app: FastifyInstance) {
    app.delete('/:id', async (request, reply) => {
        const controller = new BatchController()
        
        await controller.deleteBatch(request.params.id)

        return reply.status(204).send()
    })
}

export async function enrollUserInBatch(app: FastifyInstance) {
    app.post('/enroll', async (request, reply) => {
        const controller = new BatchController()
        
        await controller.enrollUserInBatch(request.user.id, request.body)

        return reply.status(204).send()
    })
}
