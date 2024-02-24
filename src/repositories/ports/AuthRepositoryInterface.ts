export interface IAuthRepository {
    createUser(name: string, email: string, password: string): Promise<any>
}
