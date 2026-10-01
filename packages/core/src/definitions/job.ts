export enum JobStatus {
  PENDING = 'Pending',
  PROCESSING = 'Processing',
  COMPLETE = 'Complete',
  RETRY = 'Retry',
  FAILED = 'Failed',
  DEAD_LETTER = 'DeadLetter',
}

export interface JobResponse {
  uid: string;
  status: JobStatus;
  expectedSeconds: number;
  error?: string;
}

export function isJobResponse(value: unknown): value is JobResponse {
  if (value == null || typeof value !== 'object') return false;

  const response = value as Record<string, unknown>;
  return typeof response.uid === 'string' && typeof response.status === 'string';
}

export function isJobTerminal(status: JobStatus): boolean {
  return status === JobStatus.COMPLETE || status === JobStatus.FAILED || status === JobStatus.DEAD_LETTER;
}
