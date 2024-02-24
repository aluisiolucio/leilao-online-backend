import fastify from "fastify";

import { errorHandler } from "./hooks/errorHandler";
import { authHandler } from "./hooks/authHandler";

import { signUp } from "./routes/auth";

const app = fastify({ logger: true })

app.addHook('onError', errorHandler)
app.addHook('onRequest', authHandler)

app.register(signUp, { prefix: '/api/auction' })

app.listen({ port: 3333 }).then(() => {
  console.log("HTTP server running on port 3333...")
})