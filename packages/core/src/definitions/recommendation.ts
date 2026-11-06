export const RecommendationUrl = {
  recommendation: 'recommendation',
  confirm: (id: number) => `recommendation/${id}/confirm`,
  reject: (id: number) => `recommendation/${id}/reject`,
};

export enum RecommendationStatus {
  CREATED = 'Created',
  PENDING = 'Pending',
  EXPIRED = 'Expired',
  REJECTED = 'Rejected',
  COMPLETED = 'Completed',
}

export enum RecommendationType {
  INVITATION = 'Invitation',
  REQUEST = 'Request',
}

export enum RecommendationMethod {
  REF_CODE = 'RefCode',
  MAIL = 'Mail',
  RECOMMENDATION_CODE = 'RecommendationCode',
}

export interface Recommendation {
  id: number;
  /** Absent once the code has been used. */
  code?: string;
  status: RecommendationStatus;
  type: RecommendationType;
  method: RecommendationMethod;
  name?: string;
  mail?: string;
  confirmationDate?: Date;
  /** Absent for mail invitations, which do not expire. */
  expirationDate?: Date;
}

export interface CreateRecommendation {
  recommendedMail?: string;
  recommendedAlias: string;
}
