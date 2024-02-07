import { type LoginInputDTO, type SignupInputDTO, type TokenDTO } from '@auth';

export interface AuthService {
  signup: (data: SignupInputDTO) => Promise<TokenDTO>;
  login: (data: LoginInputDTO) => Promise<TokenDTO>;
}
