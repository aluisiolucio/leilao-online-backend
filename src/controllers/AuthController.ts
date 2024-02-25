import { z } from 'zod';
import { AuthRepository } from '../repositories/AuthRepository';
import { AuthUseCase } from '../useCases/AuthUseCase';
import { schemaError } from '../errors/schemaError';

export class AuthController {
    private authRepository: AuthRepository

    constructor() {
        this.authRepository = new AuthRepository()
    }

    public async signUp(requestBody: unknown) {
        const createUserSchema = z.object({
            name: z.string(),
            email: z.string().email(),
            password: z.string().min(12),
        }).safeParse(requestBody)

        if (!createUserSchema.success) {
            schemaError(createUserSchema)
        }

        const { name, email, password } = createUserSchema.data
        const authUseCase = new AuthUseCase(this.authRepository)
        const user = await authUseCase.createUser(name, email, password)

        return user
    }

    public async signIn(requestBody: unknown) {
        const signInSchema = z.object({
            email: z.string().email(),
            password: z.string(),
        }).safeParse(requestBody)

        const { email, password } = signInSchema.data
        const authUseCase = new AuthUseCase(this.authRepository)
        const user = await authUseCase.authenticate(email, password)

        return user
    }
}