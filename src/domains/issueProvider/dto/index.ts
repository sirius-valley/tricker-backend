/**
 * Data transfer object representing an issue provider.
 */
export class IssueProviderDTO {
  /**
   * The ID of the issue provider.
   *
   * @type {string}
   */
  id: string;

  /**
   * The name of the issue provider.
   *
   * @type {string}
   */
  name: string;

  constructor(provider: IssueProviderDTO) {
    this.id = provider.id;
    this.name = provider.name;
  }
}
