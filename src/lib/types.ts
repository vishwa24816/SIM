

export interface CryptoCurrency {
  id: string;
  name: string;
  symbol: string;
  icon: React.ComponentType<{ className?: string }>;
  price: number;
  change24h: number;
  volume24h: number;
  priceHistory: { time: string; value: number }[];
  assetType: 'Spot' | 'Futures' | 'Mutual Fund' | 'Crypto ETF' | 'Web3';
}

export interface Holding {
  cryptoId: string;
  amount: number;
  margin?: number; // Margin used for futures or total cost for spot
  assetType: CryptoCurrency['assetType'];
  stopLoss?: number;
  takeProfit?: number;
  trailingStopLoss?: {
    percentage: number;
  };
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

export interface Alert {
    id: string;
    cryptoId: string;
    cryptoSymbol: string;
    price: number;
    status: 'active' | 'triggered';
    createdAt: string;
}

export interface BasketItem {
    id: string;
    name: string;
    symbol: string;
    assetType: CryptoCurrency['assetType'];
    quantity: number;
    price: number;
    orderType: string;
    investmentType: string;
}

export interface Basket {
  name: string;
  items: BasketItem[];
}

export type SystematicPlanType = 'sip' | 'swp';
export type SPInvestmentType = 'amount' | 'qty';
export type SPFrequency = 'daily' | 'weekly' | 'monthly' | 'annually';

export interface SystematicPlan {
  id: string;
  instrumentId: string;
  instrumentName: string;
  instrumentSymbol: string;
  planType: SystematicPlanType;
  investmentType: SPInvestmentType; // For SIP
  amount: number; // SIP installment or SWP withdrawal amount
  lumpsumAmount?: number; // For SWP
  frequency: SPFrequency;
  status: 'active' | 'paused' | 'cancelled';
  createdAt: string;
}

export interface HodlOrder {
  id: string;
  instrumentId: string;
  instrumentName: string;
  instrumentSymbol: string;
  assetType: CryptoCurrency['assetType'];
  quantity: number;
  price: number;
  orderType: 'limit' | 'market';
  period: {
    months: number;
    years: number;
  };
  margin: number;
  stopLoss?: number;
  takeProfit?: number;
  createdAt: string;
}

export interface LimitOrder {
    id: string;
    instrumentId: string;
    instrumentName: string;
    instrumentSymbol: string;
    assetType: CryptoCurrency['assetType'];
    action: 'BUY' | 'SELL';
    orderType: 'limit';
    price: number;
    quantity: number;
    status: 'Open' | 'Executed' | 'Cancelled';
    stopLoss?: number;
    takeProfit?: number;
    trailingStopLoss?: {
      percentage: number;
    };
}
