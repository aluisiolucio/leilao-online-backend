import { FastifyInstance } from 'fastify';
import { AuthController } from '../controllers/AuthController';


export async function signUp(app: FastifyInstance) {
    app.post('/signup', async (request, reply) => {
        const controller = new AuthController()
        const user = await controller.signUp(request.body)

        return reply.status(201).send(user) 
    })
}