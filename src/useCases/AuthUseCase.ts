import { HTTPError } from '../errors/httpError'
import { IAuthRepository } from '../repositories/ports/AuthRepositoryInterface'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export class AuthUseCase {
  constructor(private readonly userRepository: IAuthRepository) {}

  public async createUser(name: string, email: string, password: string) {
    const emailExists = await this.userRepository.emailExists(email)

    if (emailExists) {
      throw new HTTPError(400, 'Email já cadastrado')
    }

    const passwordHash = await bcrypt.hash(password, 10)

    return await this.userRepository.createUser(name, email, passwordHash)
  }

  public async authenticate(email: string, password: string) {
    const user = await this.userRepository.getUserByEmail(email)

    if (!user) {
      throw new HTTPError(400, 'Email ou senha incorretos')
    }

    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      throw new HTTPError(400, 'Email ou senha incorretos')
    }

    const payload = {
      id: user.id,
      email: user.email,
      name: user.name
    }

    const token = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '1d', algorithm: 'HS256' })

    return { accessToken: token }
  }
}