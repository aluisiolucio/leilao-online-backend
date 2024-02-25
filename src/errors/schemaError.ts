import { HTTPError } from "./httpError"

export function schemaError(schema: any) {
    const formatted = schema.error.format()
    const property = Object.keys(formatted)[1]
    const message = formatted[property]?._errors[0] || 'Corpo da requisição inválido'

    throw new HTTPError(400, `${property}: ${message}`)
}