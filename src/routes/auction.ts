import { FastifyInstance, FastifyRequest } from 'fastify';
import { AuctionController } from '../controllers/AuctionController';
import { QueryParamsAuction } from '../types/auction';

interface CustomRequest extends FastifyRequest {
    user: {
        id: string
    }
    params: {
        id: string
    }
}

export async function postAuction(app: FastifyInstance) {
    app.post('/', async (request, reply) => {
        const controller = new AuctionController()
        
        const auction = await controller.createAuction(request.body, (request as CustomRequest).user.id)

        return reply.status(201).send(auction)
    })
}

export async function getAuction(app: FastifyInstance) {
    app.get('/', async (request, reply) => {
        const controller = new AuctionController()
        
        const auctions = await controller.getAuctions(request.query as QueryParamsAuction, (request as CustomRequest).user.id)

        return reply.status(200).send(auctions)
    })
}

export async function getAuctionById(app: FastifyInstance) {
    app.get('/:id', async (request, reply) => {
        const controller = new AuctionController()
        
        const auction = await controller.getAuctionById((request as CustomRequest).params.id, (request as CustomRequest).user.id)

        return reply.status(200).send(auction)
    })
}

export async function updateAuction(app: FastifyInstance) {
    app.put('/:id', async (request, reply) => {
        const controller = new AuctionController()
        
        const auction = await controller.updateAuction((request as CustomRequest).id, request.body)

        return reply.status(200).send(auction)
    })
}

export async function deleteAuction(app: FastifyInstance) {
    app.delete('/:id', async (request, reply) => {
        const controller = new AuctionController()
        
        await controller.deleteAuction((request as CustomRequest).params.id)

        return reply.status(204).send()
    })
}