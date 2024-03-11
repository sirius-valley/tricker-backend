export class AdministratorDTO {
  id: string;
  email: string;

  constructor(input: AdministratorDTO) {
    this.id = input.id;
    this.email = input.email;
  }
}
