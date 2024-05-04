import { FastifyRequest, FastifyReply } from 'fastify'
import jwt from 'jsonwebtoken'

interface CustomRequest extends FastifyRequest {
    user: unknown
}

export function authHandler(request: FastifyRequest, reply: FastifyReply, done: any) {
    try {
        if (!request.url.includes('/signup') && !request.url.includes('/signin') && !request.url.includes('/bids')) {
            const { authorization } = request.headers

            if (!authorization) {
                return reply.status(401).send({ statusCode: 401, message: 'Token não informado' })
            }
    
            const [, token] = authorization.split(' ')
    
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string)

            if (!decoded) {
                return reply.status(401).send({ statusCode: 401, message: 'Token inválido' })
            }

            (request as CustomRequest).user = decoded
        }
    } catch (error) {

        if (error instanceof jwt.JsonWebTokenError) {
            return reply.status(401).send({ statusCode: 401, message: 'Token inválido' })
        }

        console.error('Erro ao executar o Hook (authHandler)', error)

        reply.status(500).send({ statusCode: 500, message: 'Erro interno no servidor' })
    }

    done()
}

export function authWSHandler(token: string, done: any) {
    try {
        const authorizationHeader = token;
        const accessToken = authorizationHeader ? authorizationHeader.replace('Bearer ', '') : null;

        if (!accessToken) {
            return done(new Error('Token não informado'))
        }

        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET as string)

        if (!decoded) {
            return done(new Error('Token inválido'))
        }

        return decoded
    } catch (error) {
        console.error('Erro ao executar o Hook (authWSHandler)', error)
        done(new Error('Erro interno no servidor'))
    }

    done()
}