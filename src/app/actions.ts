'use server';

import { summarizeMarketNews } from '@/ai/flows/summarize-market-news';
import { screenCryptos } from '@/ai/flows/crypto-screener-flow';
import { backtestStrategy } from '@/ai/flows/backtest-strategy-flow';
import { CryptoCurrency, BacktestResult } from '@/lib/types';

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
    try {
        const result = await backtestStrategy({ strategy, history });
        // The portfolioHistory is no longer needed in the UI, so we can omit it.
        return { ...result, portfolioHistory: [] };
    } catch (error) {
        console.error('Error running backtest:', error);
        // Return a default or error state if the flow fails
        return {
            netPnl: 0,
            netPnlPercentage: 0,
            totalTrades: 0,
            winRate: 0,
            maxDrawdown: 0,
            sharpeRatio: 0,
            portfolioHistory: [],
            trades: [],
        };
    }
}
