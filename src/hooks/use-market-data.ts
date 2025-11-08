
"use client";

import { useState, useEffect, useMemo, useRef } from 'react';
import { CryptoCurrency } from '@/lib/types';
import { INITIAL_CRYPTO_DATA, CRYPTO_ETFS_DATA, MUTUAL_FUNDS_DATA } from '@/lib/data';

const defaultCrypto = INITIAL_CRYPTO_DATA[0];

export type Exchange = 'binance' | 'coinbase';

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

export function useMarketData() {
  const [loading, setLoading] = useState(true);
  const [marketData, setMarketData] = useState<CryptoCurrency[]>(ALL_INITIAL_SPOT_ASSETS);
  const [selectedCryptoId, setSelectedCryptoId] = useState<string>(defaultCrypto.id);
  const [exchange, setExchange] = useState<Exchange>('binance');
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Close any existing connection
    if (wsRef.current) {
      wsRef.current.close();
    }
    
    setLoading(false);

    let ws: WebSocket;

    const connect = () => {
      const spotAssets = INITIAL_CRYPTO_DATA.filter(crypto => crypto.assetType === 'Spot');

      if (exchange === 'binance') {
        const binanceSymbols = ['BTC', 'ETH', 'BNB', 'DOGE', 'SOL', 'XRP', 'ADA', 'AVAX', 'SHIB', 'DOT', 'MATIC'];
        const streamNames = spotAssets
          .filter(c => binanceSymbols.includes(c.symbol))
          .map(crypto => `${crypto.symbol.toLowerCase()}usdt@kline_1m`)
          .join('/');
        ws = new WebSocket(`wss://stream.binance.com:9443/ws/${streamNames}`);
      } else { // Coinbase
        ws = new WebSocket('wss://ws-feed.exchange.coinbase.com');
      }

      wsRef.current = ws;

      ws.onopen = () => {
        console.log(`Connected to ${exchange} WebSocket ✅`);
        if (exchange === 'coinbase') {
          const productIds = spotAssets.map(crypto => `${crypto.symbol.toUpperCase()}-USD`);
          ws.send(JSON.stringify({
            type: 'subscribe',
            product_ids: productIds,
            channels: ['ticker'],
          }));
        }
      };

      ws.onmessage = (event) => {
        const parsedData = JSON.parse(event.data);
        
        let update: { id: string, price: number, time: string } | null = null;
        
        if (exchange === 'binance' && parsedData.e === 'kline') {
          const candle = parsedData.k;
          const cryptoSymbol = parsedData.s.replace('USDT', '');
          const crypto = spotAssets.find(c => c.symbol.toUpperCase() === cryptoSymbol);
          if (crypto) {
            update = { id: crypto.id, price: parseFloat(candle.c), time: new Date(candle.t).toISOString() };
          }
        } else if (exchange === 'coinbase' && parsedData.type === 'ticker' && parsedData.price) {
           const cryptoSymbol = parsedData.product_id.split('-')[0];
           const crypto = spotAssets.find(c => c.symbol.toUpperCase() === cryptoSymbol);
           if (crypto) {
             update = { id: crypto.id, price: parseFloat(parsedData.price), time: parsedData.time };
           }
        }
        
        if (update) {
            setMarketData(prevData => {
                return prevData.map(crypto => {
                    if (crypto.id === update!.id) {
                        const newPrice = update!.price;
                        // Find the last price point to calculate change
                        const lastPrice = crypto.priceHistory.length > 0 ? crypto.priceHistory[crypto.priceHistory.length -1].value : newPrice;
                        const change24h = lastPrice > 0 ? ((newPrice - lastPrice) / lastPrice) * 100 + crypto.change24h : crypto.change24h;

                        const newHistory = [
                            ...crypto.priceHistory.slice(1),
                            { time: update!.time, value: newPrice },
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
        // Optional: attempt to reconnect
      };
    };

    connect();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [exchange]);

  const futuresData = useMemo(() => marketData
    .filter(crypto => crypto.assetType === 'Spot' && crypto.id !== 'tether' && crypto.id !== 'usd-coin')
    .map(crypto => ({
      ...crypto,
      price: crypto.price, // Futures price tracks spot for this simulation
      symbol: `${crypto.symbol}-FUT`,
      name: `${crypto.name} Futures`,
      id: `${crypto.id}-fut`,
      assetType: 'Futures' as const,
  })), [marketData]);

  const combinedMarketData = useMemo(() => [...marketData, ...futuresData], [marketData, futuresData]);

  const selectedCrypto = useMemo(() => {
    return combinedMarketData.find(c => c.id === selectedCryptoId) || combinedMarketData[0] || defaultCrypto;
  }, [combinedMarketData, selectedCryptoId]);

  return { loading, marketData: combinedMarketData, selectedCrypto, setSelectedCryptoId, exchange, setExchange };
}
