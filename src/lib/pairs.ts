
export interface TradingPair {
  exchange: 'Binance' | 'Coinbase';
  pair: string;
  baseAsset: string;
  quoteAsset: string;
  status: 'TRADING' | 'active';
}

export const spotPairs: TradingPair[] = [
  { exchange: 'Binance', pair: 'BTCUSDT', baseAsset: 'BTC', quoteAsset: 'USDT', status: 'TRADING' },
  { exchange: 'Binance', pair: 'ETHUSDT', baseAsset: 'ETH', quoteAsset: 'USDT', status: 'TRADING' },
  { exchange: 'Binance', pair: 'BNBUSDT', baseAsset: 'BNB', quoteAsset: 'USDT', status: 'TRADING' },
  { exchange: 'Binance', pair: 'SOLUSDT', baseAsset: 'SOL', quoteAsset: 'USDT', status: 'TRADING' },
  { exchange: 'Binance', pair: 'XRPUSDT', baseAsset: 'XRP', quoteAsset: 'USDT', status: 'TRADING' },
  { exchange: 'Coinbase', pair: 'BTC-USD', baseAsset: 'BTC', quoteAsset: 'USD', status: 'active' },
  { exchange: 'Coinbase', pair: 'ETH-USD', baseAsset: 'ETH', quoteAsset: 'USD', status: 'active' },
  { exchange: 'Coinbase', pair: 'SOL-USD', baseAsset: 'SOL', quoteAsset: 'USD', status: 'active' },
  { exchange: 'Coinbase', pair: 'XRP-USD', baseAsset: 'XRP', quoteAsset: 'USD', status: 'active' },
];

export const futuresPairs: TradingPair[] = [
  { exchange: 'Binance', pair: 'BTCUSDT', baseAsset: 'BTC', quoteAsset: 'USDT', status: 'TRADING' },
  { exchange: "Binance", pair: "ETHUSDT", baseAsset: "ETH", quoteAsset: "USDT", status: "TRADING" },
  { exchange: "Binance", pair: "SOLUSDT", baseAsset: "SOL", quoteAsset: "USDT", status: "TRADING" },
  { exchange: "Binance", pair: "XRPUSDT", baseAsset: "XRP", quoteAsset: "USDT", status: "TRADING" },
  { exchange: "Coinbase", pair: "BTC-USD", baseAsset: "BTC", quoteAsset: "USD", status: "active" },
  { exchange: "Coinbase", pair: "ETH-USD", baseAsset: "ETH", quoteAsset: "USD", status: "active" },
  { exchange: "Coinbase", pair: "SOL-USD", baseAsset: "SOL", quoteAsset: "USD", status: "active" },
];
