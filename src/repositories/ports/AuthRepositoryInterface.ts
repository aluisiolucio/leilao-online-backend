export interface IAuthRepository {
    createUser(name: string, email: string, password: string): Promise<object>
    emailExists(email: string): Promise<boolean>
}
