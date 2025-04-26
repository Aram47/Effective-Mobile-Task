export enum AppealStatus {
  NEW = 'NEW',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface Appeal {
  id: string;
  topic: string;
  text: string;
  status: AppealStatus;
  resolution?: string;
  cancellationReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class AppealEntity {
  constructor(private appeal: Appeal) {}

  assign() {
    if (this.appeal.status !== AppealStatus.NEW) {
      throw new Error('Cannot assign non-new appeal');
    }
    this.appeal.status = AppealStatus.IN_PROGRESS;
    this.appeal.updatedAt = new Date();
  }

  complete(resolution: string) {
    if (this.appeal.status !== AppealStatus.IN_PROGRESS) {
      throw new Error('Cannot complete non-in-progress appeal');
    }
    this.appeal.status = AppealStatus.COMPLETED;
    this.appeal.resolution = resolution;
    this.appeal.updatedAt = new Date();
  }

  cancel(reason: string) {
    if (this.appeal.status === AppealStatus.COMPLETED || this.appeal.status === AppealStatus.CANCELLED) {
      throw new Error('Cannot cancel completed or cancelled appeal');
    }
    this.appeal.status = AppealStatus.CANCELLED;
    this.appeal.cancellationReason = reason;
    this.appeal.updatedAt = new Date();
  }

  getData() {
    return this.appeal;
  }
}