import { IAuthRepository } from '../repositories/ports/AuthRepositoryInterface';
import bcrypt from 'bcrypt';

export class AuthUseCase {
  constructor(private readonly userRepository: IAuthRepository) {}

  public async createUser(name: string, email: string, password: string) {
    const passwordHash = await bcrypt.hash(password, 10)

    return await this.userRepository.createUser(name, email, passwordHash);
  }
}