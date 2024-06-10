/**
 * Data Transfer Object (DTO) representing pending project authorizations.
 */
export class PendingProjectAuthorizationDTO {
  /** The unique identifier of the pending authorization. */
  id: string;

  /** The identifier of the project in the provider's system. */
  providerProjectId: string;

  /** The authorization token associated with the project. */
  token: string | null;

  /** The identifier of the issue provider. */
  issueProviderId: string;

  /** The identifier of the integrator responsible for the authorization. */
  integratorId: string;

  /** The identifier of the organization associated with the project. */
  organizationId: string;

  /** A flag indicating whether the project is being integrated. */
  isIntegrating: boolean;

  /**
   * Constructs a new PendingProjectAuthorizationDTO object.
   * @param pendingProject The object containing data for the pending project authorization.
   */
  constructor(pendingProject: PendingProjectAuthorizationDTO) {
    this.id = pendingProject.id;
    this.providerProjectId = pendingProject.providerProjectId;
    this.token = pendingProject.token;
    this.issueProviderId = pendingProject.issueProviderId;
    this.integratorId = pendingProject.integratorId;
    this.organizationId = pendingProject.organizationId;
    this.isIntegrating = pendingProject.isIntegrating;
  }
}
