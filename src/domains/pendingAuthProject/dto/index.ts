export class PendingAuthProjectDTO {
  id: string;
  providerProjectId: string;
  projectToken: string;
  memberMails: string[];
  providerId: string;
  integratorId: string;

  constructor(pendingProject: PendingAuthProjectDTO) {
    this.id = pendingProject.id;
    this.providerProjectId = pendingProject.providerProjectId;
    this.projectToken = pendingProject.projectToken;
    this.memberMails = pendingProject.memberMails;
    this.providerId = pendingProject.providerId;
    this.integratorId = pendingProject.integratorId;
  }
}
