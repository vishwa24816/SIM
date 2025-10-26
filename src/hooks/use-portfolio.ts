
"use client";

import { useState, useMemo } from 'react';
import { Portfolio, CryptoCurrency, Holding } from '@/lib/types';
import { useToast } from './use-toast';

const INITIAL_PORTFOLIO: Portfolio = {
  usdBalance: 10000,
  holdings: [],
};

export function usePortfolio(marketData: CryptoCurrency[]) {
  const [portfolio, setPortfolio] = useState<Portfolio>(INITIAL_PORTFOLIO);
  const { toast } = useToast();

  const addUsd = (amount: number) => {
    if (amount <= 0) {
      toast({ variant: "destructive", title: "Invalid Amount", description: "Please enter a positive amount to add." });
      return;
    }
    setPortfolio(prev => ({
      ...prev,
      usdBalance: prev.usdBalance + amount
    }));
    toast({ title: "Funds Added", description: `$${amount.toFixed(2)} has been added to your wallet.` });
  };

  const withdrawUsd = (amount: number) => {
    if (amount <= 0) {
      toast({ variant: "destructive", title: "Invalid Amount", description: "Please enter a positive amount to withdraw." });
      return;
    }
    if (amount > portfolio.usdBalance) {
      toast({ variant: "destructive", title: "Insufficient Funds", description: "Withdrawal amount cannot exceed your balance." });
      return;
    }
    setPortfolio(prev => ({
      ...prev,
      usdBalance: prev.usdBalance - amount
    }));
    toast({ title: "Withdrawal Successful", description: `$${amount.toFixed(2)} has been withdrawn from your wallet.` });
  };


  const buy = (cryptoId: string, margin: number, quantity?: number) => {
    if (margin <= 0) {
      toast({ variant: "destructive", title: "Invalid Amount", description: "Please enter a positive amount." });
      return;
    }
    
    if (portfolio.usdBalance < margin) {
      toast({ variant: "destructive", title: "Insufficient Funds", description: "You do not have enough USD to make this purchase." });
      return;
    }
    
    const crypto = marketData.find(c => c.id === cryptoId);
    if (!crypto) return;

    const cryptoAmount = quantity ?? margin / crypto.price;

    setPortfolio(prev => {
      const existingHolding = prev.holdings.find(h => h.cryptoId === cryptoId);
      let newHoldings: Holding[];

      if (existingHolding) {
        newHoldings = prev.holdings.map(h =>
          h.cryptoId === cryptoId ? { ...h, amount: h.amount + cryptoAmount, margin: (h.margin ?? 0) + margin } : h
        );
      } else {
        newHoldings = [...prev.holdings, { cryptoId, amount: cryptoAmount, margin }];
      }

      return {
        usdBalance: prev.usdBalance - margin,
        holdings: newHoldings,
      };
    });
    toast({ title: "Purchase Successful", description: `You bought ${cryptoAmount.toFixed(6)} ${crypto.symbol}.` });
  };

  const sell = (cryptoId: string, cryptoAmount: number) => {
    if (cryptoAmount <= 0) {
        toast({ variant: "destructive", title: "Invalid Amount", description: "Please enter a positive amount." });
        return;
    }

    const holding = portfolio.holdings.find(h => h.cryptoId === cryptoId);
    if (!holding || holding.amount < cryptoAmount) {
      toast({ variant: "destructive", title: "Insufficient Holdings", description: `You do not have enough holdings to sell.` });
      return;
    }
    
    const crypto = marketData.find(c => c.id === cryptoId);
    if (!crypto) return;

    const usdAmount = cryptoAmount * crypto.price;

    setPortfolio(prev => {
      const newHoldings = prev.holdings.map(h =>
        h.cryptoId === cryptoId ? { ...h, amount: h.amount - cryptoAmount } : h
      ).filter(h => h.amount > 0.000001); // Remove if amount is negligible

      return {
        usdBalance: prev.usdBalance + usdAmount,
        holdings: newHoldings,
      };
    });
    toast({ title: "Sale Successful", description: `You sold ${cryptoAmount.toFixed(6)} ${crypto.symbol} for $${usdAmount.toFixed(2)}.` });
  };

  const totalPortfolioValue = useMemo(() => {
    const holdingsValue = portfolio.holdings.reduce((total, holding) => {
      const crypto = marketData.find(c => c.id === holding.cryptoId);
      if (!crypto) return total;
      if (crypto.assetType === 'Futures') {
        // For futures, their contribution to equity is based on margin, not full value
        return total;
      }
      return total + (holding.amount * crypto.price);
    }, 0);
    // Add margins of futures positions to the total value
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
