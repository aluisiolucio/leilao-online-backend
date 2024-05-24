import fastify from "fastify";
import cors from '@fastify/cors'
import websocket from "@fastify/websocket";

import { HTTPError } from "./errors/httpError";
import { authHandler } from "./hooks/authHandler";

import { signUp, signIn, presignedUrl } from "./routes/auth";
import { deleteAuction, getAuction, getAuctionById, postAuction, updateAuction } from "./routes/auction";
import { confirmInscription, deleteBatch, enrollUserInBatch, getBatchById, getEnrolledBatchs, postBatch, putBatch } from "./routes/batch";
// import { lancesHttp } from "./routes/http/lancesHttp";
import { bids } from "./routes/ws/bids";

const app = fastify()

app.register(cors, {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
})

app.register(websocket)

app.register(signUp, { prefix: '/api/auth' })
app.register(signIn, { prefix: '/api/auth' })
app.register(presignedUrl, { prefix: '/api/auth' })

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
app.register(getEnrolledBatchs, { prefix: '/api/batch' })
app.register(confirmInscription, { prefix: '/api/batch' })

app.register(bids, { prefix: '/api/batch' })
// app.register(lancesHttp, { prefix: '/api/batch' })

app.addHook('preHandler', authHandler)

app.setErrorHandler((error: HTTPError, request, reply) => {
  if (error.statusCode >= 400 && error.statusCode < 500) {
    reply.status(error.statusCode).send({ statusCode: error.statusCode, message: error.message })
  }

  console.log(error)
  reply.status(500).send({ statusCode: 500, message: 'Erro Interno no Servidor' })
})

app.listen({ port: 3000, host: '0.0.0.0' }).then(() => {
  console.log("HTTP server running on port 3000...")
})