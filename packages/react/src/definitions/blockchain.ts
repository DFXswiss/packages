export enum Blockchain {
  DEFICHAIN = 'DeFiChain',
  BITCOIN = 'Bitcoin',
  LIGHTNING = 'Lightning',
  LIQUID = 'Liquid',
  MONERO = 'Monero',
  ETHEREUM = 'Ethereum',
  BINANCE_SMART_CHAIN = 'BinanceSmartChain',
  OPTIMISM = 'Optimism',
  ARBITRUM = 'Arbitrum',
  POLYGON = 'Polygon',
  BASE = 'Base',
  HAQQ = 'Haqq',
  ARWEAVE = 'Arweave',
  CARDANO = 'Cardano',
}

export function getExplorerUrl(blockchain: Blockchain): string | undefined {
  return BlockchainExplorerUrls[blockchain];
}

const BlockchainExplorerUrls: { [b in Blockchain]: string | undefined } = {
  [Blockchain.DEFICHAIN]: 'https://defiscan.live',
  [Blockchain.BITCOIN]: 'https://mempool.space',
  [Blockchain.LIGHTNING]: undefined,
  [Blockchain.MONERO]: 'https://xmrscan.org',
  [Blockchain.ETHEREUM]: 'https://etherscan.io',
  [Blockchain.BINANCE_SMART_CHAIN]: 'https://bscscan.com',
  [Blockchain.OPTIMISM]: 'https://optimistic.etherscan.io',
  [Blockchain.ARBITRUM]: 'https://arbiscan.io',
  [Blockchain.POLYGON]: 'https://polygonscan.com',
  [Blockchain.BASE]: 'https://basescan.org',
  [Blockchain.HAQQ]: 'https://explorer.haqq.network',
  [Blockchain.LIQUID]: 'https://blockstream.info/liquid',
  [Blockchain.ARWEAVE]: 'https://arscan.io',
  [Blockchain.CARDANO]: 'https://cardanoscan.io',
};
