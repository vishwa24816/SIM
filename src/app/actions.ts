
'use server';

import { summarizeMarketNews } from '@/ai/flows/summarize-market-news';
import { screenCryptos } from '@/ai/flows/crypto-screener-flow';
import { CryptoCurrency } from '@/lib/types';

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
