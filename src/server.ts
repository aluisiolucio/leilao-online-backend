import fastify from "fastify";

import { HTTPError } from "./errors/httpError";
import { authHandler } from "./hooks/authHandler";

import { signUp, signIn } from "./routes/auth";
import { deleteAuction, getAuction, getAuctionById, postAuction, updateAuction } from "./routes/auction";
import { deleteBatch, enrollUserInBatch, getBatchById, postBatch, putBatch } from "./routes/batch";

const app = fastify()

app.register(signUp, { prefix: '/api/auth' })
app.register(signIn, { prefix: '/api/auth' })

app.register(postAuction, { prefix: '/api/auction' })
app.register(getAuction, { prefix: '/api/auction' })
app.register(getAuctionById, { prefix: '/api/auction' })
app.register(updateAuction, { prefix: '/api/auction' })
app.register(deleteAuction, { prefix: '/api/auction' })

app.register(postBatch, { prefix: '/api/batch' })
app.register(getBatchById, { prefix: '/api/batch' })
app.register(putBatch, { prefix: '/api/batch' })
app.register(deleteBatch, { prefix: '/api/batch' })
app.register(enrollUserInBatch, { prefix: '/api/batch' })

app.addHook('preHandler', authHandler)

app.setErrorHandler((error: HTTPError, request, reply) => {
  if (error.statusCode >= 400 && error.statusCode < 500) {
    reply.status(error.statusCode).send({ statusCode: error.statusCode, message: error.message })
  }

  console.log(error)
  reply.status(500).send({ statusCode: 500, message: 'Erro Interno no Servidor' })
})

app.listen({ port: 3333 }).then(() => {
  console.log("HTTP server running on port 3333...")
})