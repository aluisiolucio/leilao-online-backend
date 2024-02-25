import fastify from "fastify";

import { authHandler } from "./hooks/authHandler";

import { signUp, signIn } from "./routes/auth";
import { HTTPError } from "./errors/httpError";

const app = fastify({ logger: true })

app.register(signUp, { prefix: '/api/auction' })
app.register(signIn, { prefix: '/api/auction' })

app.addHook('preHandler', authHandler)

app.setErrorHandler((error: HTTPError, request, reply) => {
  if (error.statusCode >= 400 && error.statusCode < 500) {
    reply.status(error.statusCode).send({ statusCode: error.statusCode, message: error.message })
  }

  reply.status(500).send({ statusCode: 500, message: 'Erro Interno no Servidor' })
})

app.listen({ port: 3333 }).then(() => {
  console.log("HTTP server running on port 3333...")
})