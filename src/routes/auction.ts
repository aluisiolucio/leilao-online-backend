import { FastifyInstance } from 'fastify';
import { AuctionController } from '../controllers/AuctionController';
import { QueryParamsAuction } from '../types/auction';


export async function postAuction(app: FastifyInstance) {
    app.post('/', async (request, reply) => {
        const controller = new AuctionController()
        
        const auction = await controller.createAuction(request.body, request.user.id)

        return reply.status(201).send(auction)
    })
}

export async function getAuction(app: FastifyInstance) {
    app.get('/', async (request, reply) => {
        const controller = new AuctionController()
        
        const auctions = await controller.getAuctions(request.query as QueryParamsAuction, request.user.id)

        return reply.status(200).send(auctions)
    })
}

export async function getAuctionById(app: FastifyInstance) {
    app.get('/:id', async (request, reply) => {
        const controller = new AuctionController()
        
        const auction = await controller.getAuctionById(request.params.id, request.user.id)

        return reply.status(200).send(auction)
    })
}

export async function updateAuction(app: FastifyInstance) {
    app.put('/:id', async (request, reply) => {
        const controller = new AuctionController()
        
        const auction = await controller.updateAuction(request.params.id, request.body)

        return reply.status(200).send(auction)
    })
}

export async function deleteAuction(app: FastifyInstance) {
    app.delete('/:id', async (request, reply) => {
        const controller = new AuctionController()
        
        await controller.deleteAuction(request.params.id)

        return reply.status(204).send()
    })
}