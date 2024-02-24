import { z } from 'zod';
import { AuthRepository } from '../repositories/AuthRepository';
import { AuthUseCase } from '../useCases/AuthUseCase';

export class AuthController {
    private authRepository: AuthRepository

    constructor() {
        this.authRepository = new AuthRepository()
    }

    public async signUp(requestBody: unknown) {
        const createUserBody = z.object({
            name: z.string(),
            email: z.string().email(),
            password: z.string(),
        })

        const { name, email, password } = createUserBody.parse(requestBody)
        const authUseCase = new AuthUseCase(this.authRepository)
        const user = await authUseCase.createUser(name, email, password)

        return user
    }
}