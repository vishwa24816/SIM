
"use client";

import * as React from 'react';
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
  buy: (cryptoId: string, margin: number, marketData: CryptoCurrency[], quantity?: number) => void;
  sell: (cryptoId: string, cryptoAmount: number, marketData: CryptoCurrency[]) => void;
}

const usePortfolioStore = create<PortfolioState>()(
    persist(
        (set, get) => ({
            portfolio: INITIAL_PORTFOLIO,
            addUsd: (amount) => {
                const { toast } = useToast();
                if (amount <= 0) {
                    toast({ variant: "destructive", title: "Invalid Amount", description: "Please enter a positive amount to add." });
                    return;
                }
                set(state => ({
                    portfolio: {
                        ...state.portfolio,
                        usdBalance: state.portfolio.usdBalance + amount
                    }
                }));
                toast({ title: "Funds Added", description: `$${amount.toFixed(2)} has been added to your wallet.` });
            },
            withdrawUsd: (amount) => {
                const { toast } = useToast();
                if (amount <= 0) {
                    toast({ variant: "destructive", title: "Invalid Amount", description: "Please enter a positive amount to withdraw." });
                    return;
                }
                if (amount > get().portfolio.usdBalance) {
                    toast({ variant: "destructive", title: "Insufficient Funds", description: "Withdrawal amount cannot exceed your balance." });
                    return;
                }
                set(state => ({
                    portfolio: {
                        ...state.portfolio,
                        usdBalance: state.portfolio.usdBalance - amount
                    }
                }));
                toast({ title: "Withdrawal Successful", description: `$${amount.toFixed(2)} has been withdrawn from your wallet.` });
            },
            buy: (cryptoId, margin, marketData, quantity) => {
                const { toast } = useToast();
                if (margin <= 0) {
                    toast({ variant: "destructive", title: "Invalid Amount", description: "Please enter a positive amount." });
                    return;
                }
                
                const currentPortfolio = get().portfolio;
                if (currentPortfolio.usdBalance < margin) {
                    toast({ variant: "destructive", title: "Insufficient Funds", description: "You do not have enough USD to make this purchase." });
                    return;
                }
                
                const crypto = marketData.find(c => c.id === cryptoId);
                if (!crypto) {
                     toast({ variant: "destructive", title: "Crypto not found" });
                    return;
                };

                const cryptoAmount = quantity ?? margin / crypto.price;

                set(state => {
                    const existingHolding = state.portfolio.holdings.find(h => h.cryptoId === cryptoId);
                    let newHoldings: Holding[];

                    if (existingHolding) {
                        newHoldings = state.portfolio.holdings.map(h =>
                            h.cryptoId === cryptoId ? { ...h, amount: h.amount + cryptoAmount, margin: (h.margin ?? 0) + margin } : h
                        );
                    } else {
                        newHoldings = [...state.portfolio.holdings, { cryptoId, amount: cryptoAmount, margin }];
                    }

                    return {
                        portfolio: {
                            usdBalance: state.portfolio.usdBalance - margin,
                            holdings: newHoldings,
                        }
                    };
                });
                toast({ title: "Purchase Successful", description: `You bought ${cryptoAmount.toFixed(6)} ${crypto.symbol}.` });
            },
            sell: (cryptoId, cryptoAmount, marketData) => {
                const { toast } = useToast();
                if (cryptoAmount <= 0) {
                    toast({ variant: "destructive", title: "Invalid Amount", description: "Please enter a positive amount." });
                    return;
                }

                const holding = get().portfolio.holdings.find(h => h.cryptoId === cryptoId);
                if (!holding || holding.amount < cryptoAmount) {
                    toast({ variant: "destructive", title: "Insufficient Holdings", description: `You do not have enough holdings to sell.` });
                    return;
                }
                
                const crypto = marketData.find(c => c.id === cryptoId);
                if (!crypto) {
                    toast({ variant: "destructive", title: "Crypto not found" });
                    return;
                }

                const usdAmount = cryptoAmount * crypto.price;

                set(state => {
                    const newHoldings = state.portfolio.holdings.map(h =>
                        h.cryptoId === cryptoId ? { ...h, amount: h.amount - cryptoAmount } : h
                    ).filter(h => h.amount > 0.000001); // Remove if amount is negligible

                    return {
                        portfolio: {
                           usdBalance: state.portfolio.usdBalance + usdAmount,
                           holdings: newHoldings,
                        }
                    };
                });
                toast({ title: "Sale Successful", description: `You sold ${cryptoAmount.toFixed(6)} ${crypto.symbol} for $${usdAmount.toFixed(2)}.` });
            },
        }),
        {
            name: 'crypto-portfolio-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);

export function usePortfolio(marketData: CryptoCurrency[]) {
  const { 
    portfolio, 
    addUsd, 
    withdrawUsd,
    buy: storeBuy,
    sell: storeSell,
  } = usePortfolioStore();

  const buy = (cryptoId: string, margin: number, quantity?: number) => {
    storeBuy(cryptoId, margin, marketData, quantity);
  }

  const sell = (cryptoId: string, cryptoAmount: number) => {
    storeSell(cryptoId, cryptoAmount, marketData);
  }
  
  const totalPortfolioValue = React.useMemo(() => {
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
  }, [portfolio, marketData]);

  return { portfolio, buy, sell, totalPortfolioValue, addUsd, withdrawUsd };
}
