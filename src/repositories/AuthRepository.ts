import { User } from '@prisma/client'
import { prisma } from '../db/prisma'
import { IAuthRepository } from './ports/AuthRepositoryInterface'

export class AuthRepository implements IAuthRepository {
    public async createUser(name: string, email: string, password: string): Promise<object> {
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password,
            }
        })

        return { id: user.id, name: user.name, email: user.email }
    }

    public async getUserByEmail(email: string): Promise<User | null> {
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        })

        if (!user) {
            return null
        }

        return user
    }

    public async emailExists(email: string): Promise<boolean> {
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        })

        return !!user
    }
}