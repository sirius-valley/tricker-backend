export class PendingMemberMailDTO {
  id: string;
  email: string;
  pendingProjectAuthorizationId: string;

  constructor(mail: PendingMemberMailDTO) {
    this.id = mail.id;
    this.email = mail.email;
    this.pendingProjectAuthorizationId = mail.pendingProjectAuthorizationId;
  }
}
