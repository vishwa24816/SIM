

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
  buy: (crypto: CryptoCurrency, usdAmount: number, quantity: number, options?: BuyOptions) => void;
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
                
                const cryptoAmount = quantity;
                
                set(state => {
                    const existingHoldingIndex = state.portfolio.holdings.findIndex(h => h.cryptoId === crypto.id);
                    let newHoldings: Holding[];

                    if (existingHoldingIndex > -1) {
                        newHoldings = [...state.portfolio.holdings];
                        const existingHolding = newHoldings[existingHoldingIndex];
                        
                        const newTotalAmount = existingHolding.amount + cryptoAmount;
                        const newTotalMargin = (existingHolding.margin ?? 0) + usdAmount;

                        newHoldings[existingHoldingIndex] = {
                            ...existingHolding,
                            amount: newTotalAmount,
                            margin: newTotalMargin,
                            stopLoss: options?.stopLoss ?? existingHolding.stopLoss,
                            takeProfit: options?.takeProfit ?? existingHolding.takeProfit,
                            trailingStopLoss: options?.trailingStopLoss ?? existingHolding.trailingStopLoss,
                        };
                         // If the position is closed, remove it
                        if (Math.abs(newTotalAmount) < 0.000001) {
                            newHoldings.splice(existingHoldingIndex, 1);
                        }

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
                toast({ title: 'Trade Successful', description: `Order for ${Math.abs(cryptoAmount).toFixed(6)} ${crypto.symbol} placed.` });
            },
            sell: (crypto, cryptoAmountToSell) => {
                 if (cryptoAmountToSell <= 0) {
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

                    if (crypto.assetType !== 'Futures' && holding.amount < cryptoAmountToSell) {
                         toast({ variant: 'destructive', title: 'Insufficient Holdings', description: `Not enough ${crypto.symbol} to sell.` });
                        return state;
                    }
                    
                    let newHoldings = [...state.portfolio.holdings];
                    let updatedUsdBalance = state.portfolio.usdBalance;

                    if (crypto.assetType === 'Futures') {
                        // Squaring off a futures position
                        const baseAsset = get().portfolio.holdings.find(c => c.cryptoId === crypto.id.replace('-fut',''));
                        const margin = holding.margin || 0;
                        const leverage = margin > 0 ? Math.abs((holding.amount * crypto.price) / margin) : 1;
                        const entryPrice = margin > 0 && holding.amount !== 0 ? Math.abs((margin * leverage) / holding.amount) : crypto.price;
                        
                        const pnl = (crypto.price - entryPrice) * holding.amount;
                        
                        updatedUsdBalance += margin + pnl;
                        newHoldings = state.portfolio.holdings.filter(h => h.cryptoId !== crypto.id);
                        
                        toast({ title: 'Position Squared Off', description: `Closed position for ${crypto.symbol}. P&L: $${pnl.toFixed(2)}` });

                    } else {
                        // Selling a spot asset
                        const usdGained = cryptoAmountToSell * crypto.price;
                        const newAmount = holding.amount - cryptoAmountToSell;
                        
                        const proportionSold = holding.amount > 0 ? cryptoAmountToSell / holding.amount : 1;
                        const marginToReturn = (holding.margin ?? 0) * proportionSold;
                        const newMargin = (holding.margin ?? 0) - marginToReturn;

                        if (newAmount < 0.000001) {
                            newHoldings = state.portfolio.holdings.filter(h => h.cryptoId !== crypto.id);
                        } else {
                            newHoldings[holdingIndex] = { ...holding, amount: newAmount, margin: newMargin };
                        }
                        
                        updatedUsdBalance += usdGained;
                        toast({ title: 'Sale Successful', description: `Sold ${cryptoAmountToSell.toFixed(6)} ${crypto.symbol}.` });
                    }
                    
                    return {
                        portfolio: {
                           ...state.portfolio,
                           usdBalance: updatedUsdBalance,
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
            }
        }),
        {
            name: 'crypto-portfolio-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
    
