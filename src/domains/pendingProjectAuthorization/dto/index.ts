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

export class PendingProjectInputDTO {
  providerProjectId: string;
  token: string;
  issueProviderId: string;
  integratorId: string;
  organizationId: string;

  constructor(data: PendingProjectInputDTO) {
    this.integratorId = data.integratorId;
    this.token = data.token;
    this.organizationId = data.organizationId;
    this.providerProjectId = data.providerProjectId;
    this.issueProviderId = data.issueProviderId;
  }
}
