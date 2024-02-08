import { type SignupInputDTO, type TokenDTO, type LoginInputDTO } from '../dto';

export interface AuthService {
  signup: (data: SignupInputDTO) => Promise<TokenDTO>;
  login: (data: LoginInputDTO) => Promise<TokenDTO>;
}
