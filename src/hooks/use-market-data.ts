
"use client";

import { useState, useEffect, useMemo } from 'react';
import { CryptoCurrency } from '@/lib/types';
import { INITIAL_CRYPTO_DATA } from '@/lib/data';

const defaultCrypto = INITIAL_CRYPTO_DATA[0];

export function useMarketData() {
  const [loading, setLoading] = useState(true);
  const [marketData, setMarketData] = useState<CryptoCurrency[]>(INITIAL_CRYPTO_DATA);
  const [selectedCryptoId, setSelectedCryptoId] = useState<string>(defaultCrypto.id);

  const fetchMarketData = async (isInitialLoad = false) => {
    if (isInitialLoad) {
        setLoading(true);
    }
    try {
      const response = await fetch('/api/market-data');
      if (!response.ok) {
        // Don't throw an error, just log it and the app will use the existing (or initial) data.
        console.error('Failed to fetch market data:', response.statusText);
        // If the initial load fails, we should stop the loading state.
        if (isInitialLoad) {
          setLoading(false);
          // And ensure we have some data to show
          setMarketData(INITIAL_CRYPTO_DATA);
        }
        return;
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
      if (isInitialLoad) {
        setMarketData(INITIAL_CRYPTO_DATA);
      }
    } finally {
        if (isInitialLoad) {
            setLoading(false);
        }
    }
  };


  useEffect(() => {
    fetchMarketData(true); // Initial fetch
    const intervalId = setInterval(() => {
      fetchMarketData(false);
    }, 6000); // Poll every 6 seconds

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  const selectedCrypto = useMemo(() => {
    return marketData.find(c => c.id === selectedCryptoId) || marketData[0] || defaultCrypto;
  }, [marketData, selectedCryptoId]);

  return { loading, marketData, selectedCrypto, setSelectedCryptoId, fetchMarketData };
}
