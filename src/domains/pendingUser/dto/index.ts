export class PendingUserDTO {
  id: string;
  email: string;
  projectId: string;
  status: AuthorizationStatus;
  createdAt: Date;
  statusUpdatedAt: Date | null;

  constructor(pendingUser: PendingUserDTO) {
    this.id = pendingUser.id;
    this.email = pendingUser.email;
    this.projectId = pendingUser.projectId;
    this.status = pendingUser.status;
    this.createdAt = pendingUser.createdAt;
    this.statusUpdatedAt = pendingUser.statusUpdatedAt;
  }
}

const AuthorizationStatusType: {
  ACCEPTED: 'ACCEPTED';
  PENDING: 'PENDING';
} = {
  ACCEPTED: 'ACCEPTED',
  PENDING: 'PENDING',
};

export type AuthorizationStatus = (typeof AuthorizationStatusType)[keyof typeof AuthorizationStatusType];
