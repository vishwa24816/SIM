
"use client";

import { useState, useEffect, useMemo } from 'react';
import { CryptoCurrency } from '@/lib/types';
import { INITIAL_CRYPTO_DATA, CRYPTO_ETFS_DATA, MUTUAL_FUNDS_DATA } from '@/lib/data';

const defaultCrypto = INITIAL_CRYPTO_DATA[0];

// Combine all initial data into one array
const ALL_INITIAL_ASSETS: CryptoCurrency[] = [
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
  const [marketData, setMarketData] = useState<CryptoCurrency[]>(() => {
    const baseData = ALL_INITIAL_ASSETS;
    const futuresData = baseData
      .filter(crypto => crypto.assetType === 'Spot' && !['tether', 'usd-coin'].includes(crypto.id))
      .map(crypto => ({
        ...crypto,
        symbol: `${crypto.symbol}-FUT`,
        name: `${crypto.name} Futures`,
        id: `${crypto.id}-fut`,
        assetType: 'Futures' as const,
      }));
    return [...baseData, ...futuresData];
  });
  const [selectedCryptoId, setSelectedCryptoId] = useState<string>(defaultCrypto.id);

  useEffect(() => {
    const eventSource = new EventSource('/api/market-stream');
    setLoading(false); // We have initial data, so we're not "loading" in a blocking sense

    eventSource.onmessage = (event) => {
      const update = JSON.parse(event.data);
      const symbol = update.id.toUpperCase();

      setMarketData(prevData => {
        const newData = prevData.map(crypto => {
          if (crypto.symbol.toLowerCase() === update.id.toLowerCase() && crypto.assetType === 'Spot') {
            const oldPrice = crypto.price;
            const newPrice = update.price;
            const change24h = ((newPrice - oldPrice) / oldPrice) * 100 + crypto.change24h;
            
            const newHistory = [
                ...crypto.priceHistory.slice(1),
                { time: new Date().toISOString().split('T')[0], value: newPrice },
            ];

            return {
              ...crypto,
              price: newPrice,
              change24h: isNaN(change24h) ? crypto.change24h : change24h,
              priceHistory: newHistory,
            };
          }
          // Update futures price based on spot price change
          if (crypto.assetType === 'Futures' && crypto.id.startsWith(update.id)) {
             return { ...crypto, price: update.price };
          }
          return crypto;
        });
        return newData;
      });
    };

    eventSource.onerror = (err) => {
      console.error("EventSource failed:", err);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const selectedCrypto = useMemo(() => {
    return marketData.find(c => c.id === selectedCryptoId) || marketData[0] || defaultCrypto;
  }, [marketData, selectedCryptoId]);

  return { loading, marketData, selectedCrypto, setSelectedCryptoId };
}
