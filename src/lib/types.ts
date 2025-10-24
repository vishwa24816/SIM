export interface CryptoCurrency {
  id: string;
  name: string;
  symbol: string;
  icon: React.ComponentType<{ className?: string }>;
  price: number;
  change24h: number;
  volume24h: number;
  priceHistory: { time: string; value: number }[];
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
