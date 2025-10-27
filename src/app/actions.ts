
'use server';

import { summarizeMarketNews } from '@/ai/flows/summarize-market-news';
import { screenCryptos } from '@/ai/flows/crypto-screener-flow';
import { backtestStrategy } from '@/ai/flows/backtest-strategy-flow';
import { CryptoCurrency, BacktestResult, BacktestTrade } from '@/lib/types';

export async function getNewsSummary(articles: string[]): Promise<string> {
  try {
    if (!articles || articles.length === 0) {
      return "No articles provided to summarize.";
    }
    const result = await summarizeMarketNews({ newsArticles: articles });
    return result.summary;
  } catch (error) {
    console.error('Error summarizing news:', error);
    return 'Failed to generate summary due to an internal error. Please try again later.';
  }
}

export async function getAiScreenedCryptos(prompt: string, cryptos: CryptoCurrency[]): Promise<string[]> {
  try {
    const result = await screenCryptos({
      prompt,
      cryptos: cryptos.map(c => ({ id: c.id, name: c.name, symbol: c.symbol, description: '' })) // Note: Description is not available, but schema expects it.
    });
    return result.cryptos.map(c => c.id);
  } catch (error) {
    console.error('Error screening cryptos:', error);
    return [];
  }
}

export async function runBacktest(strategy: string, history: { time: string; value: number }[]): Promise<BacktestResult> {
    const initialCapital = 10000000;
    try {
        // Step 1: Get trades from the AI
        const { trades: rawTrades } = await backtestStrategy({ strategy, history });

        if (!rawTrades || rawTrades.length === 0) {
            return {
                netPnl: 0,
                netPnlPercentage: 0,
                totalTrades: 0,
                winRate: 0,
                maxDrawdown: 0,
                sharpeRatio: 0,
                trades: [],
            };
        }

        // Step 2: Calculate metrics reliably in code
        let portfolioHistory: { time: string; value: number }[] = [];
        let btcHoldings = 0;
        let inrBalance = initialCapital;
        let peakPortfolioValue = initialCapital;
        let maxDrawdown = 0;
        const buyPrices: number[] = [];
        const trades: BacktestTrade[] = [];

        // Create a map of trades by date for quick lookup
        const tradesByDate = new Map<string, BacktestTrade>();
        rawTrades.forEach(t => tradesByDate.set(t.date, t));

        for (const day of history) {
            const tradeForDay = tradesByDate.get(day.time);

            if (tradeForDay) {
                let tradePnl = 0;
                if (tradeForDay.type === 'BUY') {
                    const cost = tradeForDay.price * tradeForDay.quantity;
                    if (inrBalance >= cost) {
                        inrBalance -= cost;
                        btcHoldings += tradeForDay.quantity;
                        // Store buy prices for P&L calculation
                        for(let i = 0; i < tradeForDay.quantity; i++) {
                            buyPrices.push(tradeForDay.price);
                        }
                    }
                } else if (tradeForDay.type === 'SELL') {
                    if (btcHoldings >= tradeForDay.quantity) {
                        const revenue = tradeForDay.price * tradeForDay.quantity;
                        inrBalance += revenue;
                        btcHoldings -= tradeForDay.quantity;
                        
                        // Calculate P&L for this sell trade
                        const soldAssetBuyPrices = buyPrices.splice(0, tradeForDay.quantity);
                        const totalCostOfSoldAssets = soldAssetBuyPrices.reduce((acc, price) => acc + price, 0);
                        tradePnl = revenue - totalCostOfSoldAssets;
                    }
                }
                 trades.push({ ...tradeForDay, pnl: tradePnl });
            }
            
            const portfolioValue = inrBalance + btcHoldings * day.value;
            portfolioHistory.push({ time: day.time, value: portfolioValue });

            if (portfolioValue > peakPortfolioValue) {
                peakPortfolioValue = portfolioValue;
            }
            const drawdown = ((peakPortfolioValue - portfolioValue) / peakPortfolioValue);
            if (drawdown > maxDrawdown) {
                maxDrawdown = drawdown;
            }
        }
        
        const finalPortfolioValue = portfolioHistory[portfolioHistory.length - 1]?.value || initialCapital;
        const netPnl = finalPortfolioValue - initialCapital;
        const netPnlPercentage = (netPnl / initialCapital) * 100;

        const sellTrades = trades.filter(t => t.type === 'SELL');
        const profitableSellTrades = sellTrades.filter(t => t.pnl > 0).length;
        const winRate = sellTrades.length > 0 ? (profitableSellTrades / sellTrades.length) * 100 : 0;
        
        // Sharpe Ratio Calculation
        const dailyReturns = portfolioHistory.slice(1).map((day, i) => {
            const prevValue = portfolioHistory[i].value;
            return prevValue > 0 ? (day.value - prevValue) / prevValue : 0;
        });

        const avgDailyReturn = dailyReturns.length > 0 ? dailyReturns.reduce((acc, r) => acc + r, 0) / dailyReturns.length : 0;
        const stdDev = dailyReturns.length > 0 ? Math.sqrt(dailyReturns.map(r => Math.pow(r - avgDailyReturn, 2)).reduce((acc, v) => acc + v, 0) / dailyReturns.length) : 0;
        
        // Assume risk-free rate is 0 for simplicity. Annualize returns and std dev.
        const annualizedReturn = avgDailyReturn * 365;
        const annualizedStdDev = stdDev * Math.sqrt(365);
        const sharpeRatio = annualizedStdDev > 0 ? annualizedReturn / annualizedStdDev : 0;
        
        return {
            netPnl,
            netPnlPercentage,
            totalTrades: trades.length,
            winRate,
            maxDrawdown: maxDrawdown * 100, // as percentage
            sharpeRatio: isNaN(sharpeRatio) ? 0 : sharpeRatio,
            trades,
        };
    } catch (error) {
        console.error('Error running backtest:', error);
        // Return a default error state
        return {
            netPnl: 0,
            netPnlPercentage: 0,
            totalTrades: 0,
            winRate: 0,
            maxDrawdown: 0,
            sharpeRatio: 0,
            trades: [],
        };
    }
}
