
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
  const [marketData, setMarketData] = useState<CryptoCurrency[]>([]);
  const [selectedCryptoId, setSelectedCryptoId] = useState<string>(defaultCrypto.id);

  const fetchMarketData = async (isInitialLoad = false) => {
    if (isInitialLoad) {
        setLoading(true);
    }
    try {
      const cryptoIds = INITIAL_CRYPTO_DATA.map(c => c.id);
      const response = await fetch(`/api/market-data?ids=${cryptoIds.join(',')}`);
      
      if (!response.ok) {
        console.error('Failed to fetch market data:', response.statusText);
        if (isInitialLoad) {
          setMarketData(ALL_INITIAL_ASSETS);
        }
        return;
      }
      
      const liveData: CryptoCurrency[] = await response.json();
      
      const baseDataMap = new Map(ALL_INITIAL_ASSETS.map(d => [d.id, d]));

      liveData.forEach(live => {
        baseDataMap.set(live.id, { ...baseDataMap.get(live.id)!, ...live, assetType: 'Spot' });
      });
      
      const combinedData = Array.from(baseDataMap.values());

      const futuresData: CryptoCurrency[] = combinedData
        .filter(crypto => crypto.assetType === 'Spot' && !['tether', 'usd-coin'].includes(crypto.id))
        .map(crypto => ({
          ...crypto,
          price: crypto.price,
          symbol: `${crypto.symbol}-FUT`,
          name: `${crypto.name} Futures`,
          id: `${crypto.id}-fut`,
          assetType: 'Futures' as const,
      }));

      setMarketData([...combinedData, ...futuresData]);

    } catch (error) {
      console.error(error);
      if (isInitialLoad) {
        const futuresData: CryptoCurrency[] = ALL_INITIAL_ASSETS
            .filter(crypto => crypto.assetType === 'Spot' && !['tether', 'usd-coin'].includes(crypto.id))
            .map(crypto => ({
            ...crypto,
            price: crypto.price,
            symbol: `${crypto.symbol}-FUT`,
            name: `${crypto.name} Futures`,
            id: `${crypto.id}-fut`,
            assetType: 'Futures' as const,
        }));
        setMarketData([...ALL_INITIAL_ASSETS, ...futuresData]);
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
