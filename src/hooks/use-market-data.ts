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
    try {
      const response = await fetch('/api/market-data');
      if (!response.ok) {
        throw new Error('Failed to fetch market data');
      }
      const data = await response.json();
      setMarketData(data);
    } catch (error) {
      console.error(error);
      // Keep using existing or initial data if fetch fails
    } finally {
        setLoading(false);
    }
  };


  useEffect(() => {
    fetchMarketData(); // Initial fetch
    
    const interval = setInterval(() => {
        fetchMarketData();
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const selectedCrypto = useMemo(() => {
    return marketData.find(c => c.id === selectedCryptoId) || marketData[0] || defaultCrypto;
  }, [marketData, selectedCryptoId]);

  return { loading, marketData, selectedCrypto, setSelectedCryptoId };
}
