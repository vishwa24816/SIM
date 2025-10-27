
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
        const { trades } = await backtestStrategy({ strategy, history });

        if (!trades || trades.length === 0) {
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

        // --- Calculate metrics in code for reliability ---
        let portfolioHistory: { time: string; value: number }[] = [];
        let btcHoldings = 0;
        let inrBalance = initialCapital;
        let peakValue = initialCapital;
        let maxDrawdown = 0;
        let buyPrices: number[] = [];

        history.forEach(day => {
            const tradeForDay = trades.find(t => t.date === day.time);
            if (tradeForDay) {
                if (tradeForDay.type === 'BUY') {
                    const cost = tradeForDay.price * tradeForDay.quantity;
                    if (inrBalance >= cost) {
                        inrBalance -= cost;
                        btcHoldings += tradeForDay.quantity;
                        // Store buy prices for P&L calculation
                        for(let i=0; i<tradeForDay.quantity; i++) {
                            buyPrices.push(tradeForDay.price);
                        }
                    }
                } else if (tradeForDay.type === 'SELL') {
                    if (btcHoldings >= tradeForDay.quantity) {
                        inrBalance += tradeForDay.price * tradeForDay.quantity;
                        btcHoldings -= tradeForDay.quantity;
                        // Remove sold asset buy prices for P&L
                        buyPrices.splice(0, tradeForDay.quantity);
                    }
                }
            }
            
            const portfolioValue = inrBalance + btcHoldings * day.value;
            portfolioHistory.push({ time: day.time, value: portfolioValue });

            if (portfolioValue > peakValue) {
                peakValue = portfolioValue;
            }
            const drawdown = ((peakValue - portfolioValue) / peakValue) * 100;
            if (drawdown > maxDrawdown) {
                maxDrawdown = drawdown;
            }
        });

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

        const avgDailyReturn = dailyReturns.reduce((acc, r) => acc + r, 0) / (dailyReturns.length || 1);
        const stdDev = Math.sqrt(dailyReturns.map(r => Math.pow(r - avgDailyReturn, 2)).reduce((acc, v) => acc + v, 0) / (dailyReturns.length || 1));
        const annualizedReturn = avgDailyReturn * 365;
        const annualizedStdDev = stdDev * Math.sqrt(365);
        const sharpeRatio = annualizedStdDev > 0 ? annualizedReturn / annualizedStdDev : 0;
        
        return {
            netPnl,
            netPnlPercentage,
            totalTrades: trades.length,
            winRate,
            maxDrawdown,
            sharpeRatio: isNaN(sharpeRatio) ? 0 : sharpeRatio,
            trades,
        };
    } catch (error) {
        console.error('Error running backtest:', error);
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
