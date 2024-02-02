export class UserModel {
  id: string
  password: string

  constructor(input: UserModel) {
    this.id = input.id;
    this.password = input.password;
  }
}