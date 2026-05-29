export const PartnerUrl = {
  getUser: (address: string) => `partner/user?address=${encodeURIComponent(address)}`,
  listUsers: 'partner/users',
  listFees: 'partner/fees',
  setOnboarding: (userDataId: number) => `partner/user/${userDataId}/onboarding`,
  removeFee: (userDataId: number, feeId: number) => `partner/user/${userDataId}/fee?fee=${feeId}`,
};

export interface PartnerUserInfo {
  id: number;
  status: string;
  mail?: string;
  firstname?: string;
  surname?: string;
  usedRef: string;
  feeIds: number[];
  canModify: boolean;
}

export interface PartnerFee {
  id: number;
  label: string;
  type: string;
  rate: number;
  fixed: number;
}

export interface SetOnboardingFee {
  feeId: number;
}
