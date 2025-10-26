
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
  const [marketData, setMarketData] = useState<CryptoCurrency[]>(ALL_INITIAL_ASSETS);
  const [selectedCryptoId, setSelectedCryptoId] = useState<string>(defaultCrypto.id);

  const fetchMarketData = async (isInitialLoad = false) => {
    if (isInitialLoad) {
        setLoading(true);
    }
    try {
      // We are only fetching live data for the base cryptocurrencies
      const cryptoIds = INITIAL_CRYPTO_DATA.map(c => c.id);
      const response = await fetch(`/api/market-data?ids=${cryptoIds.join(',')}`);
      
      if (!response.ok) {
        console.error('Failed to fetch market data:', response.statusText);
        if (isInitialLoad) {
          setMarketData(ALL_INITIAL_ASSETS);
        }
        return;
      }
      
      const liveData = await response.json();
      
      // Merge live data with our comprehensive initial data list
      const updatedData = ALL_INITIAL_ASSETS.map(initialAsset => {
        const liveCrypto = liveData.find((d: any) => d.id === initialAsset.id);
        if (liveCrypto && initialAsset.assetType === 'Spot') {
          return {
            ...initialAsset,
            price: liveCrypto.price,
            change24h: liveCrypto.change24h,
            volume24h: liveCrypto.volume24h,
            priceHistory: liveCrypto.priceHistory,
          };
        }
        // For ETFs and Mutual Funds, or if no live data, return the initial static data
        return initialAsset;
      });

      setMarketData(updatedData);
    } catch (error) {
      console.error(error);
      if (isInitialLoad) {
        setMarketData(ALL_INITIAL_ASSETS);
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
    }, 30000); // Poll every 30 seconds

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  const selectedCrypto = useMemo(() => {
    return marketData.find(c => c.id === selectedCryptoId) || marketData[0] || defaultCrypto;
  }, [marketData, selectedCryptoId]);

  return { loading, marketData, selectedCrypto, setSelectedCryptoId, fetchMarketData };
}
