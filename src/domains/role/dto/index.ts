export class RoleModel {
  id: string;
  name: string;

  constructor(role: RoleModel) {
    this.id = role.id;
    this.name = role.name;
  }
}
