export interface Asset {
  id: number;
  name: string;
  description: string;
  comingSoon: boolean;
  chainId?: string;
  explorerUrl?: string;
}
