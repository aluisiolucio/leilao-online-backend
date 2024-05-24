import { FastifyInstance } from 'fastify';
import { AuthController } from '../controllers/AuthController';
import { getSignedUploadUrl } from '../utils/verifyBatch';

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

export async function presignedUrl(app: FastifyInstance) {
    app.get('/presigned-url', async (request, reply) => {
        const key = (request.query as { key: string }).key;
    
        try {
            const signedUrl = await getSignedUploadUrl(key);

            reply.send({
                url: signedUrl
            });
        } catch (error) {
            reply.status(500).send(error);
        }
    })
}