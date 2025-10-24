"use client";

import { useState, useEffect, useMemo } from 'react';
import { CryptoCurrency } from '@/lib/types';
import { INITIAL_CRYPTO_DATA } from '@/lib/data';

const defaultCrypto = INITIAL_CRYPTO_DATA[0];

export function useMarketData() {
  const [loading, setLoading] = useState(true);
  const [marketData, setMarketData] = useState<CryptoCurrency[]>(INITIAL_CRYPTO_DATA);
  const [selectedCryptoId, setSelectedCryptoId] = useState<string>(defaultCrypto.id);

  useEffect(() => {
    setLoading(false);
    const interval = setInterval(() => {
      setMarketData(prevData =>
        prevData.map(crypto => {
          const changePercent = (Math.random() - 0.5) * 0.02; // max 2% change
          const newPrice = crypto.price * (1 + changePercent);
          const newChange24h = crypto.change24h * 0.95 + (changePercent * 100);
          const newVolume24h = crypto.volume24h * (1 + (Math.random() - 0.5) * 0.05);

          const newHistory = [
            ...crypto.priceHistory.slice(1),
            { time: new Date().toISOString().split('T')[0], value: newPrice },
          ];

          return {
            ...crypto,
            price: newPrice,
            change24h: newChange24h,
            volume24h: newVolume24h,
            priceHistory: newHistory,
          };
        })
      );
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, []);

  const selectedCrypto = useMemo(() => {
    return marketData.find(c => c.id === selectedCryptoId) || marketData[0] || defaultCrypto;
  }, [marketData, selectedCryptoId]);

  return { loading, marketData, selectedCrypto, setSelectedCryptoId };
}
