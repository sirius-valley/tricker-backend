export class PendingProjectAuthorizationDTO {
  id: string;
  providerProjectId: string;
  token: string;
  issueProviderId: string;
  integratorId: string;
  organizationId: string;

  constructor(pendingProject: PendingProjectAuthorizationDTO) {
    this.id = pendingProject.id;
    this.providerProjectId = pendingProject.providerProjectId;
    this.token = pendingProject.token;
    this.issueProviderId = pendingProject.issueProviderId;
    this.integratorId = pendingProject.integratorId;
    this.organizationId = pendingProject.organizationId;
  }
}
