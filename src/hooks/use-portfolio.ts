
"use client";

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Portfolio, CryptoCurrency, Holding } from '@/lib/types';
import { useToast } from './use-toast';

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

export const usePortfolio = create<PortfolioState>()(
    persist(
        (set, get) => ({
            portfolio: INITIAL_PORTFOLIO,
            addUsd: (amount) => {
                set(state => ({
                    portfolio: {
                        ...state.portfolio,
                        usdBalance: state.portfolio.usdBalance + amount
                    }
                }));
            },
            withdrawUsd: (amount) => {
                set(state => {
                    const currentBalance = state.portfolio.usdBalance;
                    if (amount > currentBalance) return state;
                    return {
                        portfolio: {
                            ...state.portfolio,
                            usdBalance: currentBalance - amount
                        }
                    }
                });
            },
            buy: (crypto, usdAmount, quantity) => {
                const cryptoAmount = quantity ?? usdAmount / crypto.price;
                 set(state => {
                    if (state.portfolio.usdBalance < usdAmount) {
                        return state; // Not enough funds
                    }

                    const existingHolding = state.portfolio.holdings.find(h => h.cryptoId === crypto.id);
                    let newHoldings: Holding[];

                    if (existingHolding) {
                        newHoldings = state.portfolio.holdings.map(h =>
                            h.cryptoId === crypto.id
                                ? { ...h, amount: h.amount + cryptoAmount, margin: (h.margin ?? 0) + usdAmount }
                                : h
                        );
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
            },
            sell: (crypto, cryptoAmount) => {
                const usdAmount = cryptoAmount * crypto.price;
                set(state => {
                    const holding = state.portfolio.holdings.find(h => h.cryptoId === crypto.id);
                    if (!holding || holding.amount < cryptoAmount) {
                        return state; // Not enough holdings
                    }

                    const newHoldings = state.portfolio.holdings.map(h =>
                        h.cryptoId === crypto.id ? { ...h, amount: h.amount - cryptoAmount } : h
                    ).filter(h => h.amount > 0.000001);

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

// Wrapper hook to add toast notifications
export function usePortfolioWithToast() {
  const { portfolio, addUsd, withdrawUsd, buy, sell, getPortfolioValue } = usePortfolio();
  const { toast } = useToast();

  const addUsdWithToast = (amount: number) => {
    if (amount <= 0) {
      toast({ variant: 'destructive', title: 'Invalid Amount', description: 'Please enter a positive amount.' });
      return;
    }
    addUsd(amount);
    toast({ title: 'Funds Added', description: `$${amount.toFixed(2)} has been added.` });
  };

  const withdrawUsdWithToast = (amount: number) => {
    if (amount <= 0) {
      toast({ variant: 'destructive', title: 'Invalid Amount', description: 'Please enter a positive amount.' });
      return;
    }
    if (amount > portfolio.usdBalance) {
      toast({ variant: 'destructive', title: 'Insufficient Funds', description: 'Withdrawal cannot exceed balance.' });
      return;
    }
    withdrawUsd(amount);
    toast({ title: 'Withdrawal Successful', description: `$${amount.toFixed(2)} withdrawn.` });
  };

  const buyWithToast = (crypto: CryptoCurrency, usdAmount: number, quantity?: number) => {
     if (usdAmount <= 0) {
        toast({ variant: 'destructive', title: 'Invalid Amount', description: 'Please enter a positive amount.' });
        return;
    }
    if (portfolio.usdBalance < usdAmount) {
      toast({ variant: 'destructive', title: 'Insufficient Funds', description: 'Not enough USD to make this purchase.' });
      return;
    }
    buy(crypto, usdAmount, quantity);
    const cryptoAmount = quantity ?? usdAmount / crypto.price;
    toast({ title: 'Purchase Successful', description: `Bought ${cryptoAmount.toFixed(6)} ${crypto.symbol}.` });
  };

  const sellWithToast = (crypto: CryptoCurrency, cryptoAmount: number) => {
     if (cryptoAmount <= 0) {
        toast({ variant: 'destructive', title: 'Invalid Amount', description: 'Please enter a positive amount.' });
        return;
    }
    const holding = portfolio.holdings.find(h => h.cryptoId === crypto.id);
    if (!holding || holding.amount < cryptoAmount) {
      toast({ variant: 'destructive', title: 'Insufficient Holdings', description: `Not enough ${crypto.symbol} to sell.` });
      return;
    }
    sell(crypto, cryptoAmount);
    toast({ title: 'Sale Successful', description: `Sold ${cryptoAmount.toFixed(6)} ${crypto.symbol}.` });
  };

  return { portfolio, addUsd: addUsdWithToast, withdrawUsd: withdrawUsdWithToast, buy: buyWithToast, sell: sellWithToast, getPortfolioValue };
}
