import fastify from "fastify";
import { errorHandler } from "./hooks/errorHandler";

const app = fastify()

app.addHook('onError', errorHandler)

app.listen({ port: 3333 }).then(() => {
  console.log("HTTP server running on port 3333...")
})