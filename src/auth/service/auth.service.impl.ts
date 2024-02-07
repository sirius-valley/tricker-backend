import { type LoginInputDTO, type SignupInputDTO, type TokenDTO, type AuthService } from '@auth';
import { ConflictException, UnauthorizedException } from '@utils';
import { checkPassword, encryptPassword, generateAccessToken } from '@utils/auth';
import { type UserRepository } from '@user/repository';

export class AuthServiceImpl implements AuthService {
  constructor(private readonly repository: UserRepository) {}

  async signup(data: SignupInputDTO): Promise<TokenDTO> {
    const existingUser = await this.repository.getByEmailOrUsername(data.email, data.username);
    if (existingUser != null) throw new ConflictException('USER_ALREADY_EXISTS');

    const encryptedPassword = await encryptPassword(data.password);

    const user = await this.repository.create({
      ...data,
      password: encryptedPassword,
    });
    const token = generateAccessToken({ userId: user.id });

    return { token };
  }

  async login(data: LoginInputDTO): Promise<TokenDTO> {
    const user = await this.repository.getByEmailOrUsername(data.email, data.username);
    if (user == null) throw new UnauthorizedException('BAD_CREDENTIALS');

    const isCorrectPassword = await checkPassword(data.password, user.password);

    if (!isCorrectPassword) throw new UnauthorizedException('BAD_CREDENTIALS');

    const token = generateAccessToken({ userId: user.id });

    return { token };
  }
}
