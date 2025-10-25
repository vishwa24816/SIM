export interface CryptoCurrency {
  id: string;
  name: string;
  symbol: string;
  icon: React.ComponentType<{ className?: string }>;
  price: number;
  change24h: number;
  volume24h: number;
  priceHistory: { time: string; value: number }[];
  assetType?: 'Spot' | 'Futures' | 'Mutual Fund' | 'Crypto ETF' | 'Web3';
}

export interface Holding {
  cryptoId: string;
  amount: number;
}

export interface Portfolio {
  usdBalance: number;
  holdings: Holding[];
}

export interface NewsArticle {
  id: number;
  title: string;
  source: string;
  published: string;
  url: string;
  content: string;
}

export interface MutualFund {
  id: string;
  name: string;
  symbol: string;
  icon: React.ComponentType<{ className?: string }>;
  nav: number;
  navDate: string;
  change1d: number;
  change3y: number;
  rating: string;
  risk: string;
  tags: string[];
  minSipAmount: number;
  fundSize: number;
  about: string;
  fundManager: {
    name: string;
    title: string;
    company: string;
    bio: string;
  };
  topHoldings: {
    name: string;
    symbol: string;
    percentage: number;
  }[];
  priceHistory: { time: string; value: number }[];
}

export interface CryptoETF {
  id: string;
  name: string;
  symbol: string;
  icon: React.ComponentType<{ className?: string }>;
  price: number;
  change24h: number;
  volume24h: number;
  priceHistory: { time: string; value: number }[];
  issuer: string;
  inceptionDate: string;
  expenseRatio: number;
  aum: number;
  description: string;
  underlyingAssets: {
    name: string;
    symbol: string;
    weight: number;
  }[];
}
