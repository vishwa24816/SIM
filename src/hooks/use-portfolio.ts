
'use client';

import * as React from 'react';
import { create } from 'zustand';
import { toast } from './use-toast';
import { useTransactionHistory } from './use-transaction-history';
import { doc, updateDoc, runTransaction, Firestore, serverTimestamp, setDoc, deleteDoc } from 'firebase/firestore';
import { User } from 'firebase/auth';
import { CryptoCurrency, Holding, Portfolio } from '@/lib/types';

interface BuyOptions {
    stopLoss?: number;
    takeProfit?: number;
    trailingStopLoss?: { percentage: number };
}

interface PortfolioState {
  portfolio: Portfolio;
  setPortfolio: (portfolio: Portfolio) => void;
  getPortfolioValue: (marketData: CryptoCurrency[]) => number;
  addUsd: (user: User, firestore: Firestore, amount: number) => Promise<void>;
  withdrawUsd: (user: User, firestore: Firestore, amount: number) => Promise<void>;
  buy: (user: User, firestore: Firestore, crypto: CryptoCurrency, usdAmount: number, quantity: number, options?: BuyOptions) => Promise<void>;
  sell: (user: User, firestore: Firestore, crypto: CryptoCurrency, cryptoAmountToSell: number) => Promise<void>;
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
    
    addUsd: async (user: User, firestore: Firestore, amount: number) => {
        if (!user || !firestore) {
            toast({ variant: 'destructive', title: 'Error', description: 'User not authenticated.' });
            return;
        }

        const userRef = doc(firestore, 'users', user.uid);

        try {
            await runTransaction(firestore, async (transaction) => {
                const userDoc = await transaction.get(userRef);
                if (!userDoc.exists()) {
                    throw "User document does not exist!";
                }

                const newBalance = (userDoc.data().usdBalance || 0) + amount;
                transaction.update(userRef, { usdBalance: newBalance });
            });
            toast({ title: 'Funds Added', description: `$${amount.toFixed(2)} has been added.` });
        } catch (e: any) {
            console.error("Add funds transaction failed: ", e);
            toast({ variant: 'destructive', title: 'Transaction Failed', description: typeof e === 'string' ? e : e.message });
        }
    },
    withdrawUsd: async (user: User, firestore: Firestore, amount: number) => {
        if (!user || !firestore) {
            toast({ variant: 'destructive', title: 'Error', description: 'User not authenticated.' });
            return;
        }

        const userRef = doc(firestore, 'users', user.uid);
        try {
            await runTransaction(firestore, async (transaction) => {
                const userDoc = await transaction.get(userRef);
                if (!userDoc.exists()) {
                    throw "User document does not exist!";
                }

                const currentBalance = userDoc.data().usdBalance || 0;
                if (currentBalance < amount) {
                    throw "Insufficient funds for withdrawal.";
                }

                const newBalance = currentBalance - amount;
                transaction.update(userRef, { usdBalance: newBalance });
            });
            toast({ title: 'Withdrawal Successful', description: `$${amount.toFixed(2)} withdrawn.` });
        } catch (e: any) {
            console.error("Withdraw funds transaction failed: ", e);
            toast({ variant: 'destructive', title: 'Transaction Failed', description: typeof e === 'string' ? e : e.message });
        }
    },
    buy: async (user: User, firestore: Firestore, crypto: CryptoCurrency, usdAmount: number, quantity: number, options?: BuyOptions) => {
        if (!user || !firestore) {
            toast({ variant: 'destructive', title: 'Error', description: 'User not authenticated.' });
            return;
        }

        const userRef = doc(firestore, 'users', user.uid);
        const holdingRef = doc(firestore, `users/${user.uid}/holdings/${crypto.id}`);

        try {
            await runTransaction(firestore, async (transaction) => {
                // --- READS FIRST ---
                const userDoc = await transaction.get(userRef);
                const holdingDoc = await transaction.get(holdingRef);

                if (!userDoc.exists()) throw "User document does not exist!";
                
                const currentBalance = userDoc.data().usdBalance;
                if (currentBalance < usdAmount) throw "Insufficient funds.";
                
                // --- WRITES SECOND ---
                transaction.update(userRef, { usdBalance: currentBalance - usdAmount });

                if (holdingDoc.exists()) {
                    // Update existing holding
                    const currentHolding = holdingDoc.data() as Holding;
                    const newAmount = currentHolding.amount + quantity;
                    const newMargin = (currentHolding.margin || 0) + usdAmount;
                    transaction.update(holdingRef, {
                        amount: newAmount,
                        margin: newMargin,
                        ...options
                    });
                } else {
                    // Create new holding
                    const newHolding: Holding = {
                        userId: user.uid,
                        cryptoId: crypto.id,
                        amount: quantity,
                        margin: usdAmount,
                        assetType: crypto.assetType,
                        ...options
                    };
                    transaction.set(holdingRef, newHolding);
                }
            });
            toast({ title: 'Buy Order Successful', description: `Successfully purchased ${quantity.toFixed(6)} ${crypto.symbol}` });
             useTransactionHistory.getState().addTransaction({
                type: 'BUY',
                asset: crypto.symbol,
                quantity: quantity,
                priceAtTransaction: crypto.price,
                totalValue: usdAmount,
                date: new Date().toISOString(),
                blockchainId: Math.random().toString(36).substring(2, 10).toUpperCase(),
                brokerage: usdAmount * 0.001,
                brokerageEarnedBack: 0,
            });
        } catch (error: any) {
            console.error('Buy transaction failed: ', error);
            toast({
                variant: 'destructive',
                title: 'Buy Order Failed',
                description: typeof error === 'string' ? error : error.message,
            });
        }
    },
    sell: async (user: User, firestore: Firestore, crypto: CryptoCurrency, cryptoAmountToSell: number) => {
        if (!user || !firestore) {
            toast({ variant: 'destructive', title: 'Error', description: 'User not authenticated.' });
            return;
        }

        const userRef = doc(firestore, 'users', user.uid);
        const holdingRef = doc(firestore, `users/${user.uid}/holdings/${crypto.id}`);

        try {
            await runTransaction(firestore, async (transaction) => {
                // --- READS FIRST ---
                const userDoc = await transaction.get(userRef);
                const holdingDoc = await transaction.get(holdingRef);

                if (!userDoc.exists()) throw "User document does not exist!";
                if (!holdingDoc.exists()) throw "No holding found for this asset.";

                const currentHolding = holdingDoc.data() as Holding;
                if (currentHolding.amount < cryptoAmountToSell) throw "Insufficient holding amount to sell.";
                
                // --- WRITES SECOND ---
                const usdGained = cryptoAmountToSell * crypto.price;
                const newBalance = userDoc.data().usdBalance + usdGained;
                transaction.update(userRef, { usdBalance: newBalance });

                const newAmount = currentHolding.amount - cryptoAmountToSell;
                if (newAmount < 0.000001) { // Floating point precision
                    // If selling all, delete the holding
                    transaction.delete(holdingRef);
                } else {
                    // Otherwise, update the holding
                    const proportionSold = cryptoAmountToSell / currentHolding.amount;
                    const newMargin = (currentHolding.margin || 0) * (1 - proportionSold);
                    transaction.update(holdingRef, {
                        amount: newAmount,
                        margin: newMargin
                    });
                }
            });
            toast({ title: 'Sell Order Successful', description: `Successfully sold ${cryptoAmountToSell.toFixed(6)} ${crypto.symbol}` });
            useTransactionHistory.getState().addTransaction({
                type: 'SELL',
                asset: crypto.symbol,
                quantity: cryptoAmountToSell,
                priceAtTransaction: crypto.price,
                totalValue: cryptoAmountToSell * crypto.price,
                date: new Date().toISOString(),
                blockchainId: Math.random().toString(36).substring(2, 10).toUpperCase(),
                brokerage: (cryptoAmountToSell * crypto.price) * 0.001,
                brokerageEarnedBack: 0,
            });
        } catch (error: any) {
            console.error('Sell transaction failed: ', error);
            toast({
                variant: 'destructive',
                title: 'Sell Order Failed',
                description: typeof error === 'string' ? error : error.message,
            });
        }
    },
}));
