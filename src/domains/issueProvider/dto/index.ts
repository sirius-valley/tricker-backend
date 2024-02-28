export class IssueProviderDTO {
  id: string;
  name: string;

  constructor(provider: IssueProviderDTO) {
    this.id = provider.id;
    this.name = provider.name;
  }
}
