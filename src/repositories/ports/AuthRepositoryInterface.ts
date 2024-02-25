import { User } from "@prisma/client"

export interface IAuthRepository {
    createUser(name: string, email: string, password: string): Promise<object>
    getUserByEmail(email: string): Promise<User | null>
    emailExists(email: string): Promise<boolean>
}
