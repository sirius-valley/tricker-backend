import { type UserRepository } from '@domains/user';
import { ConflictException, UnauthorizedException } from '@utils';
import { generateAccessToken } from '@utils/auth';
import { type SignupInputDTO, type TokenDTO, type LoginInputDTO } from '../dto';
import { type AuthService } from '@domains/auth';

export class AuthServiceImpl implements AuthService {
  constructor(private readonly repository: UserRepository) {}

  async signup(data: SignupInputDTO): Promise<TokenDTO> {
    const existingUser = await this.repository.getByEmailOrUsername(data.email, data.username);
    if (existingUser != null) throw new ConflictException('USER_ALREADY_EXISTS');

    const user = await this.repository.create({
      ...data,
    });
    const token = generateAccessToken({ userId: user.id });

    return { token };
  }

  async login(data: LoginInputDTO): Promise<TokenDTO> {
    const user = await this.repository.getByEmailOrUsername(data.email, data.username);
    if (user == null) throw new UnauthorizedException('BAD_CREDENTIALS');

    const token = generateAccessToken({ userId: user.id });

    return { token };
  }
}
