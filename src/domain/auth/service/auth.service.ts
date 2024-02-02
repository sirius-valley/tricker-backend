import { LoginInputDTO, SignupInputDTO, TokenDTO } from '../dto';

export interface AuthService {
  signup: (data: SignupInputDTO) => Promise<TokenDTO>;
  login: (data: LoginInputDTO) => Promise<TokenDTO>;
}
