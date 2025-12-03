
"use client";

import { useState, useEffect, useMemo, useRef } from 'react';
import { CryptoCurrency } from '@/lib/types';
import { INITIAL_CRYPTO_DATA, CRYPTO_ETFS_DATA, MUTUAL_FUNDS_DATA } from '@/lib/data';
import { spotPairs, futuresPairs } from '@/lib/pairs';

const defaultCrypto = INITIAL_CRYPTO_DATA[0];
const USD_TO_INR = 90;

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
  const binanceWsRef = useRef<WebSocket | null>(null);
  const coinbaseWsRef = useRef<WebSocket | null>(null);

  const binanceSymbols = useMemo(() => Array.from(new Set(spotPairs.map(p => p.baseAsset))), []);
  const coinbaseProductIds = useMemo(() => Array.from(new Set(spotPairs.filter(p => p.exchange === 'Coinbase').map(p => p.pair))), []);

  const connectToBinance = () => {
    if (binanceWsRef.current) binanceWsRef.current.close();
    
    const streamNames = binanceSymbols.map(symbol => `${symbol.toLowerCase()}usdt@kline_1m`).join('/');
    const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${streamNames}`);
    binanceWsRef.current = ws;

    ws.onopen = () => console.log('Connected to Binance WebSocket ✅');
    ws.onmessage = (event) => {
      const parsedData = JSON.parse(event.data);
      if (parsedData.e === 'kline') {
        const candle = parsedData.k;
        const cryptoSymbol = parsedData.s.replace('USDT', '');
        const crypto = ALL_INITIAL_SPOT_ASSETS.find(c => c.symbol.toUpperCase() === cryptoSymbol);
        if (crypto) {
          handlePriceUpdate({ id: crypto.id, price: parseFloat(candle.c) * USD_TO_INR, time: new Date(candle.t).toISOString() });
        }
      }
    };
    ws.onerror = (error) => console.error('Binance WebSocket error:', error);
    ws.onclose = () => console.log('Binance WebSocket disconnected ❌');
  };

  const connectToCoinbase = () => {
    if (coinbaseWsRef.current) coinbaseWsRef.current.close();

    const ws = new WebSocket('wss://ws-feed.exchange.coinbase.com');
    coinbaseWsRef.current = ws;

    ws.onopen = () => {
      console.log('Connected to Coinbase WebSocket ✅');
      ws.send(JSON.stringify({
        type: 'subscribe',
        product_ids: coinbaseProductIds,
        channels: ['ticker'],
      }));
    };

    ws.onmessage = (event) => {
      const parsedData = JSON.parse(event.data);
      if (parsedData.type === 'ticker' && parsedData.price) {
        const cryptoSymbol = parsedData.product_id.split('-')[0];
        const crypto = ALL_INITIAL_SPOT_ASSETS.find(c => c.symbol.toUpperCase() === cryptoSymbol);
        if (crypto) {
          handlePriceUpdate({ id: crypto.id, price: parseFloat(parsedData.price) * USD_TO_INR, time: parsedData.time });
        }
      }
    };
    ws.onerror = (error) => console.error('Coinbase WebSocket error:', error);
    ws.onclose = () => console.log('Coinbase WebSocket disconnected ❌');
  };

  const handlePriceUpdate = (update: { id: string, price: number, time: string }) => {
    setMarketData(prevData => {
      return prevData.map(crypto => {
        if (crypto.id === update.id) {
          const newPrice = update.price;
          const lastPrice = crypto.priceHistory.length > 0 ? crypto.priceHistory[crypto.priceHistory.length - 1].value : newPrice;
          const change24h = lastPrice > 0 ? ((newPrice - lastPrice) / lastPrice) * 100 + crypto.change24h : crypto.change24h;
          const newHistory = [...crypto.priceHistory.slice(1), { time: update.time, value: newPrice }];
          return { ...crypto, price: newPrice, change24h, volume24h: crypto.volume24h * (1 + (Math.random() - 0.5) * 0.01), priceHistory: newHistory };
        }
        if (crypto.assetType === 'Futures' && crypto.id === `${update.id}-fut`) {
          return { ...crypto, price: update.price };
        }
        return crypto;
      });
    });
  };

  useEffect(() => {
    setLoading(false);
    connectToBinance();
    connectToCoinbase();

    return () => {
      if (binanceWsRef.current) binanceWsRef.current.close();
      if (coinbaseWsRef.current) coinbaseWsRef.current.close();
    };
  }, []);

  const futuresData = useMemo(() => marketData
    .filter(crypto => crypto.assetType === 'Spot' && crypto.id !== 'tether' && crypto.id !== 'usd-coin')
    .map(crypto => ({
      ...crypto,
      price: crypto.price,
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
