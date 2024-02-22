import { FastifyRequest, FastifyReply } from 'fastify'

export function errorHandler(request: FastifyRequest, reply: FastifyReply, error: Error, done: any) {
    try {
        console.log(typeof done)
        console.error(error)

        reply.status(500).send({ error: 'Erro interno no servidor' })
    } catch (error) {
        console.error('Erro ao executar o Hook (errorHandler)', error)

        reply.status(500).send({ error: 'Erro interno no servidor' })
    }

    done()
}