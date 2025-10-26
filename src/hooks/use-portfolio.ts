
'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Portfolio, CryptoCurrency, Holding } from '@/lib/types';
import { useToast } from './use-toast';
import * as React from 'react';

const INITIAL_PORTFOLIO: Portfolio = {
  usdBalance: 10000,
  holdings: [],
};

interface PortfolioState {
  portfolio: Portfolio;
  addUsd: (amount: number) => void;
  withdrawUsd: (amount: number) => void;
  buy: (crypto: CryptoCurrency, usdAmount: number, quantity?: number) => void;
  sell: (crypto: CryptoCurrency, cryptoAmount: number) => void;
  getPortfolioValue: (marketData: CryptoCurrency[]) => number;
}

export const usePortfolioStore = create<PortfolioState>()(
    persist(
        (set, get) => ({
            portfolio: INITIAL_PORTFOLIO,
            addUsd: (amount) => {
                const { toast } = useToast.getState();
                if (amount <= 0) {
                    toast({ variant: 'destructive', title: 'Invalid Amount', description: 'Please enter a positive amount.' });
                    return;
                }
                set(state => ({
                    portfolio: {
                        ...state.portfolio,
                        usdBalance: state.portfolio.usdBalance + amount
                    }
                }));
                toast({ title: 'Funds Added', description: `$${amount.toFixed(2)} has been added.` });
            },
            withdrawUsd: (amount) => {
                const { toast } = useToast.getState();
                const currentBalance = get().portfolio.usdBalance;
                 if (amount <= 0) {
                    toast({ variant: 'destructive', title: 'Invalid Amount', description: 'Please enter a positive amount.' });
                    return;
                }
                if (amount > currentBalance) {
                    toast({ variant: 'destructive', title: 'Insufficient Funds', description: 'Withdrawal cannot exceed balance.' });
                    return;
                }
                set(state => ({
                    portfolio: {
                        ...state.portfolio,
                        usdBalance: currentBalance - amount
                    }
                }));
                toast({ title: 'Withdrawal Successful', description: `$${amount.toFixed(2)} withdrawn.` });
            },
            buy: (crypto, usdAmount, quantity) => {
                const { toast } = useToast.getState();
                const currentBalance = get().portfolio.usdBalance;

                if (usdAmount <= 0) {
                    toast({ variant: 'destructive', title: 'Invalid Amount', description: 'Please enter a positive amount.' });
                    return;
                }
                if (currentBalance < usdAmount) {
                    toast({ variant: 'destructive', title: 'Insufficient Funds', description: 'Not enough USD to make this purchase.' });
                    return;
                }
                
                const cryptoAmount = quantity ?? usdAmount / crypto.price;
                
                set(state => {
                    const existingHoldingIndex = state.portfolio.holdings.findIndex(h => h.cryptoId === crypto.id);
                    let newHoldings: Holding[];

                    if (existingHoldingIndex > -1) {
                        newHoldings = [...state.portfolio.holdings];
                        const existingHolding = newHoldings[existingHoldingIndex];
                        newHoldings[existingHoldingIndex] = {
                            ...existingHolding,
                            amount: existingHolding.amount + cryptoAmount,
                            margin: (existingHolding.margin ?? 0) + usdAmount,
                        };
                    } else {
                        newHoldings = [...state.portfolio.holdings, { cryptoId: crypto.id, amount: cryptoAmount, margin: usdAmount }];
                    }

                    return {
                        portfolio: {
                            ...state.portfolio,
                            usdBalance: state.portfolio.usdBalance - usdAmount,
                            holdings: newHoldings,
                        }
                    };
                });
                toast({ title: 'Purchase Successful', description: `Bought ${cryptoAmount.toFixed(6)} ${crypto.symbol}.` });
            },
            sell: (crypto, cryptoAmount) => {
                const { toast } = useToast.getState();
                 if (cryptoAmount <= 0) {
                    toast({ variant: 'destructive', title: 'Invalid Amount', description: 'Please enter a positive amount.' });
                    return;
                }
                
                set(state => {
                    const holding = state.portfolio.holdings.find(h => h.cryptoId === crypto.id);
                    if (!holding || holding.amount < cryptoAmount) {
                         toast({ variant: 'destructive', title: 'Insufficient Holdings', description: `Not enough ${crypto.symbol} to sell.` });
                        return state; // Not enough holdings
                    }
                    
                    const usdAmount = cryptoAmount * crypto.price;
                    const newHoldings = state.portfolio.holdings.map(h =>
                        h.cryptoId === crypto.id ? { ...h, amount: h.amount - cryptoAmount, margin: (h.margin ?? 0) * ((h.amount - cryptoAmount) / h.amount) } : h
                    ).filter(h => h.amount > 0.000001);

                    toast({ title: 'Sale Successful', description: `Sold ${cryptoAmount.toFixed(6)} ${crypto.symbol}.` });
                    return {
                        portfolio: {
                           ...state.portfolio,
                           usdBalance: state.portfolio.usdBalance + usdAmount,
                           holdings: newHoldings,
                        }
                    };
                });
            },
            getPortfolioValue: (marketData: CryptoCurrency[]) => {
                const { portfolio } = get();
                const holdingsValue = portfolio.holdings.reduce((total, holding) => {
                    const crypto = marketData.find(c => c.id === holding.cryptoId);
                    if (!crypto || crypto.assetType === 'Futures') return total;
                    return total + (holding.amount * crypto.price);
                }, 0);
                
                const futuresMargin = portfolio.holdings
                    .filter(h => {
                        const crypto = marketData.find(c => c.id === h.cryptoId);
                        return crypto?.assetType === 'Futures';
                    })
                    .reduce((acc, h) => acc + (h.margin ?? 0), 0);
                    
                return portfolio.usdBalance + holdingsValue + futuresMargin;
            }
        }),
        {
            name: 'crypto-portfolio-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
    