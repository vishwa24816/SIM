

'use client';

import * as React from 'react';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Portfolio, CryptoCurrency, Holding } from '@/lib/types';
import { toast } from './use-toast';

const INITIAL_PORTFOLIO: Portfolio = {
  usdBalance: 10000,
  holdings: [],
};

interface BuyOptions {
    stopLoss?: number;
    takeProfit?: number;
    trailingStopLoss?: { percentage: number };
}

interface PortfolioState {
  portfolio: Portfolio;
  addUsd: (amount: number) => void;
  withdrawUsd: (amount: number) => void;
  buy: (crypto: CryptoCurrency, usdAmount: number, quantity?: number, options?: BuyOptions) => void;
  sell: (crypto: CryptoCurrency, cryptoAmount: number) => void;
  getPortfolioValue: (marketData: CryptoCurrency[]) => number;
}

export const usePortfolioStore = create<PortfolioState>()(
    persist(
        (set, get) => ({
            portfolio: INITIAL_PORTFOLIO,
            addUsd: (amount) => {
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
            buy: (crypto, usdAmount, quantity, options) => {
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
                            stopLoss: options?.stopLoss ?? existingHolding.stopLoss,
                            takeProfit: options?.takeProfit ?? existingHolding.takeProfit,
                            trailingStopLoss: options?.trailingStopLoss ?? existingHolding.trailingStopLoss,
                        };
                    } else {
                        newHoldings = [...state.portfolio.holdings, { 
                            cryptoId: crypto.id, 
                            amount: cryptoAmount, 
                            margin: usdAmount, 
                            assetType: crypto.assetType,
                            stopLoss: options?.stopLoss,
                            takeProfit: options?.takeProfit,
                            trailingStopLoss: options?.trailingStopLoss,
                        }];
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
                 if (cryptoAmount <= 0) {
                    toast({ variant: 'destructive', title: 'Invalid Amount', description: 'Please enter a positive amount.' });
                    return;
                }
                
                set(state => {
                    const holdingIndex = state.portfolio.holdings.findIndex(h => h.cryptoId === crypto.id);
                    if (holdingIndex === -1) {
                        toast({ variant: 'destructive', title: 'No Holdings', description: `You do not have any ${crypto.symbol} to sell.` });
                        return state;
                    }
                    
                    const holding = state.portfolio.holdings[holdingIndex];
                    const amountToSell = cryptoAmount;

                    if (holding.amount < amountToSell) {
                         toast({ variant: 'destructive', title: 'Insufficient Holdings', description: `Not enough ${crypto.symbol} to sell.` });
                        return state; // Not enough holdings
                    }
                    
                    const usdGained = amountToSell * crypto.price;
                    const newAmount = holding.amount - amountToSell;
                    
                    const proportionSold = holding.amount > 0 ? amountToSell / holding.amount : 1;
                    const newMargin = (holding.margin ?? 0) * (1 - proportionSold);

                    let newHoldings: Holding[];

                    if (newAmount < 0.000001) { // If selling all or almost all
                        newHoldings = state.portfolio.holdings.filter(h => h.cryptoId !== crypto.id);
                    } else {
                        newHoldings = [...state.portfolio.holdings];
                        newHoldings[holdingIndex] = { ...holding, amount: newAmount, margin: newMargin };
                    }
                    
                    toast({ title: 'Sale Successful', description: `Sold ${amountToSell.toFixed(6)} ${crypto.symbol}.` });
                    return {
                        portfolio: {
                           ...state.portfolio,
                           usdBalance: state.portfolio.usdBalance + usdGained,
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
                
                const futuresPnL = portfolio.holdings
                    .filter(h => {
                        const crypto = marketData.find(c => c.id === h.cryptoId);
                        return crypto?.assetType === 'Futures';
                    })
                    .reduce((acc, h) => {
                        const crypto = marketData.find(c => c.id === h.cryptoId);
                        const baseAsset = marketData.find(c => c.id === h.cryptoId.replace('-fut',''));
                        if (!crypto || !baseAsset || !h.margin) return acc;
                        
                        const leverage = (h.amount * baseAsset.price) / h.margin;
                        const entryPrice = isNaN(leverage) || leverage === 0 ? 0 : (h.margin * leverage) / h.amount;
                        const pnl = (baseAsset.price - entryPrice) * h.amount;
                        return acc + pnl;
                    }, 0);

                const futuresMargin = portfolio.holdings
                    .filter(h => {
                        const crypto = marketData.find(c => c.id === h.cryptoId);
                        return crypto?.assetType === 'Futures';
                    })
                    .reduce((acc, h) => acc + (h.margin ?? 0), 0);
                    
                return portfolio.usdBalance + holdingsValue + futuresMargin + futuresPnL;
            }
        }),
        {
            name: 'crypto-portfolio-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
    
