
'use client';

import * as React from 'react';
import { create } from 'zustand';
import { toast } from './use-toast';
import { useTransactionHistory } from './use-transaction-history';
import { doc, updateDoc, runTransaction, collection, getDocs, writeBatch, getDoc, onSnapshot } from 'firebase/firestore';
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
  addUsd: (amount: number) => void;
  withdrawUsd: (amount: number) => void;
  buy: (crypto: CryptoCurrency, usdAmount: number, quantity: number, options?: BuyOptions) => void;
  sell: (crypto: CryptoCurrency, cryptoAmount: number) => void;
  getPortfolioValue: (marketData: CryptoCurrency[]) => number;
}

const usePortfolioStoreInternal = create<PortfolioState>((set, get) => ({
    portfolio: { usdBalance: 0, holdings: [] },
    setPortfolio: (portfolio) => set({ portfolio }),
    addUsd: (amount) => { /* To be implemented with Firestore */ },
    withdrawUsd: (amount) => { /* To be implemented with Firestore */ },
    buy: (crypto, usdAmount, quantity, options) => { /* To be implemented with Firestore */ },
    sell: (crypto, cryptoAmount) => { /* To be implemented with Firestore */ },
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
    }
}));


export const usePortfolioStore = () => {
    const { user } = useUser();
    const firestore = useFirestore();
    const { portfolio, setPortfolio, getPortfolioValue } = usePortfolioStoreInternal();

    const userRef = useMemoFirebase(() => {
        if (!user) return null;
        return doc(firestore, 'users', user.uid);
    }, [firestore, user]);

    const holdingsCollectionRef = useMemoFirebase(() => {
        if (!user) return null;
        return collection(firestore, `users/${user.uid}/holdings`);
    }, [firestore, user]);

    const { data: holdingsData, isLoading: isHoldingsLoading } = useCollection<Holding>(holdingsCollectionRef);
    
    React.useEffect(() => {
        if (userRef) {
            const unsub = onSnapshot(userRef, (doc) => {
                const data = doc.data();
                if (data) {
                    setPortfolio({
                        usdBalance: data.usdBalance,
                        holdings: holdingsData || [],
                    });
                }
            });
            return () => unsub();
        }
    }, [userRef, holdingsData, setPortfolio]);

    const addUsd = async (amount: number) => {
        if (!userRef) return;
        if (amount <= 0) {
            toast({ variant: 'destructive', title: 'Invalid Amount', description: 'Please enter a positive amount.' });
            return;
        }
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
    };

    const withdrawUsd = async (amount: number) => {
        if (!userRef) return;
        if (amount <= 0) {
            toast({ variant: 'destructive', title: 'Invalid Amount', description: 'Please enter a positive amount.' });
            return;
        }
        try {
            await runTransaction(firestore, async (transaction) => {
                const userDoc = await transaction.get(userRef);
                if (!userDoc.exists()) {
                    throw "User document does not exist!";
                }
                const currentBalance = userDoc.data().usdBalance || 0;
                if (amount > currentBalance) {
                    throw 'Insufficient Funds';
                }
                const newBalance = currentBalance - amount;
                transaction.update(userRef, { usdBalance: newBalance });
            });
            toast({ title: 'Withdrawal Successful', description: `$${amount.toFixed(2)} withdrawn.` });
        } catch (e: any) {
            console.error("Withdraw funds transaction failed: ", e);
            toast({ variant: 'destructive', title: 'Transaction Failed', description: typeof e === 'string' ? e : e.message });
        }
    };

    const buy = async (crypto: CryptoCurrency, usdAmount: number, quantity: number, options?: BuyOptions) => {
        if (!userRef || !holdingsCollectionRef) return;
         if (usdAmount <= 0) {
            toast({ variant: 'destructive', title: 'Invalid Amount', description: 'Please enter a positive amount.' });
            return;
        }
        
        try {
            await runTransaction(firestore, async (transaction) => {
                const userDoc = await transaction.get(userRef);
                if (!userDoc.exists()) throw "User document does not exist!";

                const currentBalance = userDoc.data().usdBalance || 0;
                if (currentBalance < usdAmount) throw "Insufficient Funds";

                transaction.update(userRef, { usdBalance: currentBalance - usdAmount });
                
                const holdingDocRef = doc(holdingsCollectionRef, crypto.id);
                const holdingDoc = await transaction.get(holdingDocRef);

                if (holdingDoc.exists()) {
                    const existingHolding = holdingDoc.data() as Holding;
                    const newAmount = existingHolding.amount + quantity;
                    const newMargin = (existingHolding.margin || 0) + usdAmount;

                    if (Math.abs(newAmount) < 0.000001) {
                        transaction.delete(holdingDocRef);
                    } else {
                        transaction.update(holdingDocRef, {
                            amount: newAmount,
                            margin: newMargin,
                            stopLoss: options?.stopLoss ?? existingHolding.stopLoss,
                            takeProfit: options?.takeProfit ?? existingHolding.takeProfit,
                            trailingStopLoss: options?.trailingStopLoss ?? existingHolding.trailingStopLoss,
                        });
                    }
                } else {
                     transaction.set(holdingDocRef, {
                        userId: user!.uid,
                        cryptoId: crypto.id,
                        amount: quantity,
                        margin: usdAmount,
                        assetType: crypto.assetType,
                        ...options
                    });
                }
            });

            useTransactionHistory.getState().addTransaction({
                type: 'BUY',
                asset: crypto.symbol,
                quantity: quantity,
                priceAtTransaction: crypto.price,
                totalValue: usdAmount * 83,
                date: new Date().toISOString(),
                blockchainId: Math.random().toString(36).substring(2, 10).toUpperCase(),
                brokerage: usdAmount * 0.001 * 83,
                brokerageEarnedBack: usdAmount * 0.0001 * 83,
            });

            toast({ title: 'Trade Successful', description: `Order for ${Math.abs(quantity).toFixed(6)} ${crypto.symbol} placed.` });

        } catch (e: any) {
            console.error("Buy transaction failed: ", e);
            toast({ variant: 'destructive', title: 'Trade Failed', description: typeof e === 'string' ? e : e.message });
        }
    };
    
    const sell = async (crypto: CryptoCurrency, cryptoAmountToSell: number) => {
        if (!userRef || !holdingsCollectionRef) return;
        if (cryptoAmountToSell <= 0) {
            toast({ variant: 'destructive', title: 'Invalid Amount', description: 'Please enter a positive amount.' });
            return;
        }

        try {
            await runTransaction(firestore, async (transaction) => {
                const holdingDocRef = doc(holdingsCollectionRef, crypto.id);
                const holdingDoc = await transaction.get(holdingDocRef);

                if (!holdingDoc.exists()) throw `No Holdings: You do not have any ${crypto.symbol} to sell.`;
                
                const holding = holdingDoc.data() as Holding;

                if (crypto.assetType !== 'Futures' && holding.amount < cryptoAmountToSell) {
                     throw `Insufficient Holdings: Not enough ${crypto.symbol} to sell.`;
                }

                const usdGained = cryptoAmountToSell * crypto.price;
                const userDoc = await transaction.get(userRef);
                const currentBalance = userDoc.data()?.usdBalance || 0;
                let newBalance = currentBalance + usdGained;

                if (crypto.assetType === 'Futures') {
                    const margin = holding.margin || 0;
                    const leverage = margin > 0 ? Math.abs((holding.amount * crypto.price) / margin) : 1;
                    const entryPrice = margin > 0 && holding.amount !== 0 ? Math.abs((margin * leverage) / holding.amount) : crypto.price;
                    const pnl = (crypto.price - entryPrice) * holding.amount;
                    newBalance = currentBalance + margin + pnl;
                    transaction.delete(holdingDocRef);
                    toast({ title: 'Position Squared Off', description: `Closed position for ${crypto.symbol}. P&L: $${pnl.toFixed(2)}` });
                } else {
                    const newAmount = holding.amount - cryptoAmountToSell;
                    const proportionSold = holding.amount > 0 ? cryptoAmountToSell / holding.amount : 1;
                    const marginToReturn = (holding.margin || 0) * proportionSold;
                    const newMargin = (holding.margin || 0) - marginToReturn;

                    if (newAmount < 0.000001) {
                        transaction.delete(holdingDocRef);
                    } else {
                        transaction.update(holdingDocRef, { amount: newAmount, margin: newMargin });
                    }
                    toast({ title: 'Sale Successful', description: `Sold ${cryptoAmountToSell.toFixed(6)} ${crypto.symbol}.` });
                }

                transaction.update(userRef, { usdBalance: newBalance });

                useTransactionHistory.getState().addTransaction({
                    type: 'SELL',
                    asset: crypto.symbol,
                    quantity: cryptoAmountToSell,
                    priceAtTransaction: crypto.price,
                    totalValue: usdGained * 83,
                    date: new Date().toISOString(),
                    blockchainId: Math.random().toString(36).substring(2, 10).toUpperCase(),
                    brokerage: usdGained * 0.001 * 83,
                    brokerageEarnedBack: usdGained * 0.0001 * 83,
                });
            });
        } catch (e: any) {
            console.error("Sell transaction failed: ", e);
            toast({ variant: 'destructive', title: 'Sale Failed', description: typeof e === 'string' ? e : e.message });
        }
    };


    return { portfolio, addUsd, withdrawUsd, buy, sell, getPortfolioValue, isLoading: isHoldingsLoading };
};
