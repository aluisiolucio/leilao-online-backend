import { prisma } from '../db/prisma'
import { IAuthRepository } from './ports/AuthRepositoryInterface'

export class AuthRepository implements IAuthRepository {
    public async createUser(name: string, email: string, password: string) {
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password,
            }
        })

        return { id: user.id, name: user.name, email: user.email }
    }
}