
'use client';

import * as React from 'react';
import { create } from 'zustand';
import { toast } from './use-toast';
import { useTransactionHistory } from './use-transaction-history';
import { doc, updateDoc, runTransaction, collection, getDocs, writeBatch, getDoc, onSnapshot, DocumentReference, Firestore, serverTimestamp } from 'firebase/firestore';
import { useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { useCollection } from '@/firebase/firestore/use-collection';
import { CryptoCurrency, Holding } from '@/lib/types';

interface Portfolio {
  usdBalance: number;
  holdings: Holding[];
}

interface BuyOptions {
    stopLoss?: number;
    takeProfit?: number;
    trailingStopLoss?: { percentage: number };
}

interface PortfolioState {
  portfolio: Portfolio;
  setPortfolio: (portfolio: Portfolio) => void;
  getPortfolioValue: (marketData: CryptoCurrency[]) => number;
  addUsd: (amount: number) => Promise<void>;
  withdrawUsd: (amount: number) => Promise<void>;
  buy: (crypto: CryptoCurrency, usdAmount: number, quantity: number, options?: BuyOptions) => Promise<void>;
  sell: (crypto: CryptoCurrency, cryptoAmountToSell: number) => Promise<void>;
}

export const usePortfolioStore = create<PortfolioState>((set, get) => ({
    portfolio: { usdBalance: 0, holdings: [] },
    setPortfolio: (portfolio) => set({ portfolio }),
    getPortfolioValue: (marketData) => {
        const { portfolio } = get();
        const holdingsValue = portfolio.holdings.reduce((total, holding) => {
            const crypto = marketData.find(c => c.id === holding.cryptoId);
            if (!crypto || crypto.assetType === 'Futures') return total;
            return total + (holding.amount * crypto.price);
        }, 0);
        
        const futuresValue = portfolio.holdings
            .filter(h => h.assetType === 'Futures')
            .reduce((acc, h) => {
                const crypto = marketData.find(c => c.id === h.cryptoId);
                const baseAsset = marketData.find(c => c.id === h.cryptoId.replace('-fut',''));
                if (!crypto || !baseAsset || !h.margin || h.amount === 0) return acc;
                
                const leverage = Math.round(Math.abs((h.amount * baseAsset.price) / h.margin));
                const entryPrice = Math.abs((h.margin * leverage) / h.amount);

                const pnl = (baseAsset.price - entryPrice) * h.amount;
                return acc + h.margin + pnl;
            }, 0);
            
        return portfolio.usdBalance + holdingsValue + futuresValue;
    },
    addUsd: async (amount: number) => {},
    withdrawUsd: async (amount: number) => {},
    buy: async (crypto: CryptoCurrency, usdAmount: number, quantity: number, options?: BuyOptions) => {},
    sell: async (crypto: CryptoCurrency, cryptoAmountToSell: number) => {},
}));
