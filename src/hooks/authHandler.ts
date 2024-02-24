import { FastifyRequest, FastifyReply } from 'fastify'

export function authHandler(request: FastifyRequest, reply: FastifyReply, done: any) {
    try {
        if (!request.url.includes('/signup') && !request.url.includes('/signin')) {
            const { authorization } = request.headers

            if (!authorization) {
                return reply.status(401).send({ error: 'Token não informado' })
            }
    
            const [, token] = authorization.split(' ')
    
            if (token !== '123') {
                return reply.status(401).send({ error: 'Token inválido' })
            }   
        }
    } catch (error) {
        console.error('Erro ao executar o Hook (authHandler)', error)

        reply.status(500).send({ error: 'Erro interno no servidor' })
    }

    done()
}