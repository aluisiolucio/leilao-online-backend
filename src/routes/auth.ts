import { FastifyInstance } from 'fastify';
import { AuthController } from '../controllers/AuthController';


export async function signUp(app: FastifyInstance) {
    app.post('/signup', async (request, reply) => {
        const controller = new AuthController()
        const user = await controller.signUp(request.body)

        return reply.status(201).send(user) 
    })
}

export async function signIn(app: FastifyInstance) {
    app.post('/signin', async (request, reply) => {
        const controller = new AuthController()
        const user = await controller.signIn(request.body)

        return reply.status(200).send(user) 
    })
}