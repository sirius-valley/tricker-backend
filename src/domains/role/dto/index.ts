export class RoleDTO {
  id: string;
  name: string;

  constructor(role: RoleDTO) {
    this.id = role.id;
    this.name = role.name;
  }
}
