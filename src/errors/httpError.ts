export class HTTPError extends Error {
    public statusCode: number

    constructor(statusCode: number, message: string) {
        super(message)

        this.name = this.constructor.name
        this.statusCode = statusCode

        Error.captureStackTrace(this, this.constructor)
    }
}