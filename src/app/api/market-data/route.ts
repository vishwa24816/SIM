import { NextResponse } from 'next/server';
import { INITIAL_CRYPTO_DATA } from '@/lib/data';

// Dynamically get IDs from the initial data
const cryptoIds = INITIAL_CRYPTO_DATA.map(crypto => crypto.id);

export async function GET() {
  try {
    const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${cryptoIds.join(',')}`;
    
    const headers: HeadersInit = {
        'Accept': 'application/json',
    };

    if (process.env.COINGECKO_API_KEY) {
      headers['x-cg-demo-api-key'] = process.env.COINGECKO_API_KEY;
    }
    
    const response = await fetch(url, {
        headers: headers
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch market data from CoinGecko: ${response.statusText}`);
    }

    const coingeckoData: any[] = await response.json();

    const updatedData = INITIAL_CRYPTO_DATA.map(initialCrypto => {
      const liveData = coingeckoData.find(d => d.id === initialCrypto.id);
      
      if (liveData) {
        const newPrice = liveData.current_price ?? initialCrypto.price;
        
        // Keep some history, but the latest point is from the API
        const newHistory = [
            ...initialCrypto.priceHistory.slice(1),
            { time: new Date().toISOString().split('T')[0], value: newPrice },
        ];

        return {
          ...initialCrypto, // Start with initial data (name, symbol, icon)
          price: newPrice,
          change24h: liveData.price_change_percentage_24h ?? initialCrypto.change24h,
          volume24h: liveData.total_volume ?? initialCrypto.volume24h,
          priceHistory: newHistory,
        };
      }
      // Return the initial data for the crypto if no live data is found
      return initialCrypto;
    });

    return NextResponse.json(updatedData);
  } catch (error) {
    console.error('Failed to fetch market data from CoinGecko:', error);
    // In case of an error, return the initial static data to prevent the app from crashing.
    return NextResponse.json(INITIAL_CRYPTO_DATA, { status: 500, statusText: "Failed to fetch live market data" });
  }
}
