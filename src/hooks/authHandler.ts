import { FastifyRequest, FastifyReply } from 'fastify'
import jwt from 'jsonwebtoken'

export function authHandler(request: FastifyRequest, reply: FastifyReply, done: any) {
    try {
        if (!request.url.includes('/signup') && !request.url.includes('/signin')) {
            const { authorization } = request.headers

            if (!authorization) {
                return reply.status(401).send({ statusCode: 401, message: 'Token não informado' })
            }
    
            const [, token] = authorization.split(' ')
    
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string)

            if (!decoded) {
                return reply.status(401).send({ statusCode: 401, message: 'Token inválido' })
            }
        }
    } catch (error) {
        console.error('Erro ao executar o Hook (authHandler)', error)

        reply.status(500).send({ statusCode: 500, message: 'Erro interno no servidor' })
    }

    done()
}