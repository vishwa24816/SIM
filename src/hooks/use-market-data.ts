
"use client";

import { useState, useEffect, useMemo, useRef } from 'react';
import { CryptoCurrency } from '@/lib/types';
import { INITIAL_CRYPTO_DATA, CRYPTO_ETFS_DATA, MUTUAL_FUNDS_DATA } from '@/lib/data';

const defaultCrypto = INITIAL_CRYPTO_DATA[0];

export type Exchange = 'binance' | 'coinbase' | 'bybit';

// Combine all initial data into one array for non-futures assets
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
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    // Close any existing connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    const newEventSource = new EventSource(`/api/market-stream?source=${exchange}`);
    eventSourceRef.current = newEventSource;
    setLoading(false);

    newEventSource.onmessage = (event) => {
      const update = JSON.parse(event.data);
      
      setMarketData(prevData => {
        return prevData.map(crypto => {
          if (crypto.id === update.id) {
            const oldPrice = crypto.price;
            const newPrice = update.price;
            const change24h = oldPrice > 0 ? ((newPrice - oldPrice) / oldPrice) * 100 + crypto.change24h : crypto.change24h;
            
            const newHistory = [
                ...crypto.priceHistory.slice(1),
                { time: new Date().toISOString(), value: newPrice },
            ];

            return {
              ...crypto,
              price: newPrice,
              change24h: isNaN(change24h) ? crypto.change24h : change24h,
              priceHistory: newHistory,
            };
          }
          return crypto;
        });
      });
    };

    newEventSource.onerror = (err) => {
      console.error("EventSource failed:", err);
      newEventSource.close();
    };

    return () => {
      newEventSource.close();
    };
  }, [exchange]);

  const combinedMarketData = useMemo(() => {
      const futuresData = marketData
      .filter(crypto => crypto.assetType === 'Spot' && !['tether', 'usd-coin'].includes(crypto.id))
      .map(crypto => ({
        ...crypto,
        symbol: `${crypto.symbol.toUpperCase()}-FUT`,
        name: `${crypto.name} Futures`,
        id: `${crypto.id}-fut`,
        assetType: 'Futures' as const,
      }));
      return [...marketData, ...futuresData];
  }, [marketData]);

  const selectedCrypto = useMemo(() => {
    return combinedMarketData.find(c => c.id === selectedCryptoId) || combinedMarketData[0] || defaultCrypto;
  }, [combinedMarketData, selectedCryptoId]);

  return { loading, marketData: combinedMarketData, selectedCrypto, setSelectedCryptoId, exchange, setExchange };
}
