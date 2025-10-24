"use client";

import { useState, useEffect, useMemo } from 'react';
import { CryptoCurrency } from '@/lib/types';
import { INITIAL_CRYPTO_DATA } from '@/lib/data';

const defaultCrypto = INITIAL_CRYPTO_DATA[0];

export function useMarketData() {
  const [loading, setLoading] = useState(true);
  const [marketData, setMarketData] = useState<CryptoCurrency[]>(INITIAL_CRYPTO_DATA);
  const [selectedCryptoId, setSelectedCryptoId] = useState<string>(defaultCrypto.id);

  const fetchMarketData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/market-data');
      if (!response.ok) {
        throw new Error('Failed to fetch market data');
      }
      const liveData = await response.json();
      
      // Merge live data with initial static data to preserve icon components
      const updatedData = INITIAL_CRYPTO_DATA.map(initialCrypto => {
        const liveCrypto = liveData.find((d: any) => d.id === initialCrypto.id);
        if (liveCrypto) {
          return {
            ...initialCrypto, // This keeps the original icon and other static properties
            price: liveCrypto.price,
            change24h: liveCrypto.change24h,
            volume24h: liveCrypto.volume24h,
            priceHistory: liveCrypto.priceHistory,
          };
        }
        return initialCrypto; // Fallback to initial data if no live data is found
      });

      setMarketData(updatedData);
    } catch (error) {
      console.error(error);
      // Keep using existing or initial data if fetch fails
      setMarketData(INITIAL_CRYPTO_DATA);
    } finally {
        setLoading(false);
    }
  };


  useEffect(() => {
    fetchMarketData(); // Fetch data once on component mount
  }, []);

  const selectedCrypto = useMemo(() => {
    return marketData.find(c => c.id === selectedCryptoId) || marketData[0] || defaultCrypto;
  }, [marketData, selectedCryptoId]);

  return { loading, marketData, selectedCrypto, setSelectedCryptoId, fetchMarketData };
}
