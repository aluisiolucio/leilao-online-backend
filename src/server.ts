import fastify from "fastify";

import { HTTPError } from "./errors/httpError";
import { authHandler } from "./hooks/authHandler";

import { signUp, signIn } from "./routes/auth";
import { getAuction, postAuction } from "./routes/auction";

const app = fastify()

app.register(signUp, { prefix: '/api/auth' })
app.register(signIn, { prefix: '/api/auth' })

app.register(postAuction, { prefix: '/api/auction' })
app.register(getAuction, { prefix: '/api/auction' })

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