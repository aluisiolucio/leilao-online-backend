import { HTTPError } from "./httpError"

export function schemaError(schema) {
    const formatted = schema.error.format()
    const proprerty = Object.keys(formatted)[1]
    const message = formatted.name?._errors[0] || formatted.email?._errors[0] || formatted.password?._errors[0] || 'Corpo da requisição inválido'

    throw new HTTPError(400, `${proprerty}: ${message}`)
}