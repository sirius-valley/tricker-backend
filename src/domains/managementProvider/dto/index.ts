export class ManagementProviderDTO {
  id: string;
  name: string;

  constructor(provider: ManagementProviderDTO) {
    this.id = provider.id;
    this.name = provider.name;
  }
}
