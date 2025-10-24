import { NextResponse } from 'next/server';
import yahooFinance from 'yahoo-finance2';
import { INITIAL_CRYPTO_DATA } from '@/lib/data';

const cryptoSymbols = {
  bitcoin: 'BTC-USD',
  ethereum: 'ETH-USD',
  dogecoin: 'DOGE-USD',
};

export async function GET() {
  try {
    const symbols = Object.values(cryptoSymbols);
    const quotes = await yahooFinance.quote(symbols);

    const updatedData = INITIAL_CRYPTO_DATA.map(crypto => {
      const symbol = cryptoSymbols[crypto.id as keyof typeof cryptoSymbols];
      const quote = quotes.find(q => q.symbol === symbol);
      
      if (quote) {
        const newPrice = quote.regularMarketPrice ?? crypto.price;
        // Keep some history, but the latest point is from the API
        const newHistory = [
            ...crypto.priceHistory.slice(1),
            { time: new Date().toISOString().split('T')[0], value: newPrice },
        ];

        return {
          ...crypto,
          price: newPrice,
          change24h: quote.regularMarketChangePercent ?? crypto.change24h,
          volume24h: quote.regularMarketVolume ?? crypto.volume24h,
          priceHistory: newHistory,
        };
      }
      return crypto;
    });

    return NextResponse.json(updatedData);
  } catch (error) {
    console.error('Failed to fetch market data from Yahoo Finance:', error);
    // In case of an error, we can return the initial static data or an error message.
    return NextResponse.json(INITIAL_CRYPTO_DATA, { status: 500 });
  }
}
