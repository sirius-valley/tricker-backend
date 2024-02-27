export class OrganizationDTO {
  id: string;
  name: string;

  constructor(organization: OrganizationDTO) {
    this.id = organization.id;
    this.name = organization.name;
  }
}
