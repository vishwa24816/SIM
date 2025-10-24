import { NextResponse } from 'next/server';
import { INITIAL_CRYPTO_DATA } from '@/lib/data';

// IDs for CoinGecko API
const cryptoIds = ['bitcoin', 'ethereum', 'dogecoin'];

export async function GET() {
  try {
    const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${cryptoIds.join(',')}`;
    const response = await fetch(url, {
        headers: {
            'Accept': 'application/json',
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch market data from CoinGecko: ${response.statusText}`);
    }

    const coingeckoData: any[] = await response.json();

    const updatedData = INITIAL_CRYPTO_DATA.map(crypto => {
      const liveData = coingeckoData.find(d => d.id === crypto.id);
      
      if (liveData) {
        const newPrice = liveData.current_price ?? crypto.price;
        
        // Keep some history, but the latest point is from the API
        const newHistory = [
            ...crypto.priceHistory.slice(1),
            { time: new Date().toISOString().split('T')[0], value: newPrice },
        ];

        return {
          ...crypto,
          price: newPrice,
          change24h: liveData.price_change_percentage_24h ?? crypto.change24h,
          volume24h: liveData.total_volume ?? crypto.volume24h,
          priceHistory: newHistory,
        };
      }
      // Return the initial data for the crypto if no live data is found
      return crypto;
    });

    return NextResponse.json(updatedData);
  } catch (error) {
    console.error('Failed to fetch market data from CoinGecko:', error);
    // In case of an error, return the initial static data to prevent the app from crashing.
    return NextResponse.json(INITIAL_CRYPTO_DATA, { status: 500, statusText: "Failed to fetch live market data" });
  }
}
