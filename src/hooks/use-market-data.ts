
"use client";

import { useState, useEffect, useMemo, useRef } from 'react';
import { CryptoCurrency } from '@/lib/types';
import { INITIAL_CRYPTO_DATA, CRYPTO_ETFS_DATA, MUTUAL_FUNDS_DATA } from '@/lib/data';

const defaultCrypto = INITIAL_CRYPTO_DATA[0];

export type Exchange = 'binance' | 'coinbase' | 'bybit';

const ALL_INITIAL_SPOT_ASSETS: CryptoCurrency[] = [
  ...INITIAL_CRYPTO_DATA,
  ...CRYPTO_ETFS_DATA.map(etf => ({ ...etf, assetType: 'Crypto ETF' as const })),
  ...MUTUAL_FUNDS_DATA.map(fund => ({
    id: fund.id,
    name: fund.name,
    symbol: fund.symbol,
    icon: fund.icon,
    price: fund.nav,
    change24h: fund.change1d,
    volume24h: fund.fundSize,
    priceHistory: fund.priceHistory,
    assetType: 'Mutual Fund' as const,
  })),
];

// A smaller list for Binance to avoid URL length issues
const BINANCE_SUB_LIST = ['BTC', 'ETH', 'DOGE', 'SHIB', 'XRP', 'TRX', 'BNB', 'ADA', 'SOL'];

export function useMarketData() {
  const [loading, setLoading] = useState(true);
  const [marketData, setMarketData] = useState<CryptoCurrency[]>(ALL_INITIAL_SPOT_ASSETS);
  const [selectedCryptoId, setSelectedCryptoId] = useState<string>(defaultCrypto.id);
  const [exchange, setExchange] = useState<Exchange>('binance');
  const wsRef = useRef<WebSocket | null>(null);
  const pingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Close any existing connection
    if (wsRef.current) {
      wsRef.current.close();
    }
    if (pingIntervalRef.current) {
      clearInterval(pingIntervalRef.current);
    }
    
    setLoading(false);

    let ws: WebSocket;

    const connect = () => {
      if (exchange === 'binance') {
        const streamNames = INITIAL_CRYPTO_DATA
          .filter(crypto => crypto.assetType === 'Spot' && BINANCE_SUB_LIST.includes(crypto.symbol))
          .map(crypto => `${crypto.symbol.toLowerCase()}usdt@trade`)
          .join('/');
        ws = new WebSocket(`wss://stream.binance.com:9443/ws/${streamNames}`);
      } else if (exchange === 'coinbase') {
        ws = new WebSocket('wss://ws-feed.exchange.coinbase.com');
      } else if (exchange === 'bybit') {
        ws = new WebSocket('wss://stream.bybit.com/v5/public/spot');
      }

      wsRef.current = ws;

      ws.onopen = () => {
        console.log(`Connected to ${exchange} WebSocket ✅`);
        if (exchange === 'coinbase') {
          const productIds = INITIAL_CRYPTO_DATA
            .filter(crypto => crypto.assetType === 'Spot')
            .map(crypto => `${crypto.symbol.toUpperCase()}-USD`);
          ws.send(JSON.stringify({
            type: 'subscribe',
            product_ids: productIds,
            channels: ['ticker'],
          }));
        } else if (exchange === 'bybit') {
          const args = INITIAL_CRYPTO_DATA
            .filter(crypto => crypto.assetType === 'Spot')
            .map(crypto => `tickers.${crypto.symbol.toUpperCase()}USDT`);
          ws.send(JSON.stringify({ op: 'subscribe', args }));
          
          pingIntervalRef.current = setInterval(() => {
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({ op: 'ping' }));
            }
          }, 20000);
        }
      };

      ws.onmessage = (event) => {
        const parsedData = JSON.parse(event.data);
        
        let update: { id: string, price: number } | null = null;
        
        if (exchange === 'binance' && parsedData.e === 'trade') {
          const cryptoId = parsedData.s.toLowerCase().replace('usdt', '');
          const crypto = INITIAL_CRYPTO_DATA.find(c => c.symbol.toLowerCase() === cryptoId);
          if (crypto) {
            update = { id: crypto.id, price: parseFloat(parsedData.p) };
          }
        } else if (exchange === 'coinbase' && parsedData.type === 'ticker' && parsedData.price) {
           const cryptoSymbol = parsedData.product_id.split('-')[0].toLowerCase();
           const crypto = INITIAL_CRYPTO_DATA.find(c => c.symbol.toLowerCase() === cryptoSymbol);
           if (crypto) {
             update = { id: crypto.id, price: parseFloat(parsedData.price) };
           }
        } else if (exchange === 'bybit' && parsedData.topic?.startsWith('tickers') && parsedData.data) {
           const trade = parsedData.data;
           const crypto = INITIAL_CRYPTO_DATA.find(c => trade.symbol.startsWith(c.symbol.toUpperCase()));
           if (crypto && trade.lastPrice) {
             update = { id: crypto.id, price: parseFloat(trade.lastPrice) };
           }
        }
        
        if (update) {
            setMarketData(prevData => {
                return prevData.map(crypto => {
                    if (crypto.id === update!.id) {
                        const newPrice = update!.price;
                        const oldPrice = crypto.price;
                        const change24h = oldPrice > 0 ? ((newPrice - oldPrice) / oldPrice) * 100 + crypto.change24h : crypto.change24h;

                        const newHistory = [
                            ...crypto.priceHistory.slice(1),
                            { time: new Date().toISOString(), value: newPrice },
                        ];
                        return { ...crypto, price: newPrice, change24h, priceHistory: newHistory };
                    }
                    // Update corresponding future price if spot price changed
                    if (crypto.assetType === 'Futures' && crypto.id === `${update!.id}-fut`) {
                      return { ...crypto, price: update!.price };
                    }
                    return crypto;
                });
            });
        }
      };

      ws.onerror = (error) => {
        console.error(`${exchange} WebSocket error:`, error);
        ws.close();
      };

      ws.onclose = () => {
        console.log(`${exchange} WebSocket disconnected ❌`);
        if (pingIntervalRef.current) {
          clearInterval(pingIntervalRef.current);
        }
      };
    };

    connect();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (pingIntervalRef.current) {
        clearInterval(pingIntervalRef.current);
      }
    };
  }, [exchange]);

  const selectedCrypto = useMemo(() => {
    return marketData.find(c => c.id === selectedCryptoId) || marketData[0] || defaultCrypto;
  }, [marketData, selectedCryptoId]);

  return { loading, marketData, selectedCrypto, setSelectedCryptoId, exchange, setExchange };
}
