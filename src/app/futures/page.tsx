
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Flame, ArrowUp, ArrowDown } from 'lucide-react';
import { BottomNav } from '@/components/dashboard/bottom-nav';
import { Header } from '@/components/dashboard/header';
import { useMarketData } from '@/hooks/use-market-data';
import { Skeleton } from '@/components/ui/skeleton';
import { CryptoList } from '@/components/dashboard/crypto-list';
import { Coins } from 'lucide-react';

const CryptoListSkeleton = () => (
    <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div>
                        <Skeleton className="h-4 w-12 mb-1" />
                        <Skeleton className="h-3 w-20" />
                    </div>
                </div>
                <div className="text-right">
                    <Skeleton className="h-4 w-24 mb-1" />
                    <Skeleton className="h-3 w-16 ml-auto" />
                </div>
            </div>
        ))}
    </div>
)


export default function FuturesPage() {
    const { marketData, loading } = useMarketData();
    const [listType, setListType] = React.useState('Gainers');
    
    const futuresData = React.useMemo(() => marketData
        .filter(crypto => crypto.assetType === 'Spot' && crypto.id !== 'tether' && crypto.id !== 'usd-coin')
        .map(crypto => ({
            ...crypto,
            price: crypto.price,
            symbol: `${crypto.symbol}-FUT`,
            name: `${crypto.name} Futures`,
            id: `${crypto.id}-fut`,
            assetType: 'Futures' as const,
    })), [marketData]);

    const trendingCrypto = [...futuresData]
      .sort((a, b) => b.volume24h - a.volume24h)
      .slice(0, 5);
    
    const topPairIds = ['bitcoin', 'ethereum', 'solana', 'cardano', 'ripple', 'dogecoin'];

    const topFuturesPairs = React.useMemo(() => {
        return futuresData.filter(c => topPairIds.includes(c.id.replace('-fut', '')));
    }, [futuresData]);

    const gainers = [...futuresData].sort((a, b) => b.change24h - a.change24h).slice(0, 5);
    const losers = [...futuresData].sort((a, b) => a.change24h - b.change24h).slice(0, 5);

    const listMap = {
        'Gainers': gainers,
        'Losers': losers,
    };
    const activeList = listMap[listType as keyof typeof listMap];

    return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
        <Header />
        <main className="flex-1 overflow-y-auto pb-20 p-4 space-y-6">
            <h1 className="text-2xl font-bold mt-4">Futures Market</h1>
            <div className="p-4">
                <h2 className="flex items-center gap-2 text-lg font-semibold mb-4"><Flame className="text-orange-500" /> Trending Futures</h2>
                <div className="divide-y">
                    {loading ? <CryptoListSkeleton /> : <CryptoList cryptos={trendingCrypto} />}
                </div>
            </div>

            <div className="p-4">
                <h2 className="flex items-center gap-2 text-lg font-semibold mb-4"><Coins className="text-primary" /> Top Futures Pairs</h2>
                <div className="divide-y">
                    {loading ? <CryptoListSkeleton /> : <CryptoList cryptos={topFuturesPairs} />}
                </div>
            </div>

            <div className="p-4">
                <h2 className="flex items-center gap-2 text-lg font-semibold mb-4">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary"><path d="M3 17L9 11L13 15L21 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M14 7H21V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    Top Gainers &amp; Losers
                </h2>
                <div className="flex rounded-md bg-muted p-1 mb-4">
                    <Button onClick={() => setListType('Gainers')} variant={listType === 'Gainers' ? 'default' : 'ghost'} className="flex-1 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
                        <ArrowUp className="mr-2 h-4 w-4 text-green-500"/> Gainers
                    </Button>
                    <Button onClick={() => setListType('Losers')} variant={listType === 'Losers' ? 'default' : 'ghost'} className="flex-1 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
                        <ArrowDown className="mr-2 h-4 w-4 text-red-500"/> Losers
                    </Button>
                </div>
                <div className="divide-y">
                     {loading ? <CryptoListSkeleton /> : <CryptoList cryptos={activeList} />}
                </div>
            </div>

        </main>
        <BottomNav />
    </div>
  );
}

    