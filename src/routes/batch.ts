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
