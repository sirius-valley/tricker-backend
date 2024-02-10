import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class TokenDTO {
  token!: string;
}

export class SignupInputDTO {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  constructor(email: string, username: string, password: string) {
    this.email = email;
    this.password = password;
    this.username = username;
  }
}

export class LoginInputDTO {
  @IsOptional()
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  username?: string;

  @IsString()
  @IsNotEmpty()
  password!: string;
}
