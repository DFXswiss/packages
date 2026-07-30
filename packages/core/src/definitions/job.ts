export const JobUrl = {
  get: (uid: string) => `job/${uid}`,
};

export enum JobStatus {
  PENDING = 'Pending',
  PROCESSING = 'Processing',
  COMPLETE = 'Complete',
  FAILED = 'Failed',
  DEAD_LETTER = 'DeadLetter',
}

export interface Job<T = unknown> {
  uid: string;
  group: string;
  status: JobStatus;
  created: Date;
  started?: Date;
  finished?: Date;
  expectedSeconds: number;
  result?: T;
  error?: string;
}

export function isJobFinished(status: JobStatus): boolean {
  return [JobStatus.COMPLETE, JobStatus.FAILED, JobStatus.DEAD_LETTER].includes(status);
}
