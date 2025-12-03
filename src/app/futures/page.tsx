
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Flame, ArrowUp, ArrowDown, Eye, Plus, Search } from 'lucide-react';
import { BottomNav } from '@/components/dashboard/bottom-nav';
import { Header } from '@/components/dashboard/header';
import { useMarketData } from '@/hooks/use-market-data';
import { CryptoCurrency } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { CryptoList } from '@/components/dashboard/crypto-list';
import { Coins } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

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
    const [watchlists, setWatchlists] = React.useState<Record<string, string[]>>({ 'Top watchlist': [] });
    const [activeWatchlist, setActiveWatchlist] = React.useState('Top watchlist');
    const [searchTerm, setSearchTerm] = React.useState('');
    
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

    const allFuturesData = React.useMemo(() => {
        return futuresData.sort((a, b) => (b.price * b.volume24h) - (a.price * a.volume24h));
    }, [futuresData]);

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

    const watchlistNames = Object.keys(watchlists);
    
    const handleAddWatchlist = () => {
        const newWatchlistName = `Watchlist ${watchlistNames.length + 1}`;
        setWatchlists(prev => ({...prev, [newWatchlistName]: []}));
        setActiveWatchlist(newWatchlistName);
    };

    const handleAddToWatchlist = (cryptoId: string) => {
        if (activeWatchlist !== 'Top watchlist' && !watchlists[activeWatchlist].includes(cryptoId)) {
            setWatchlists(prev => ({
                ...prev,
                [activeWatchlist]: [...prev[activeWatchlist], cryptoId]
            }));
        }
    };
    
    const searchResults = React.useMemo(() => {
        if (!searchTerm) return [];
        return futuresData.filter(crypto =>
            crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, futuresData]);

    const activeWatchlistCryptos = React.useMemo(() => {
        if (activeWatchlist === 'All') {
            return allFuturesData;
        }
        if (activeWatchlist === 'Top watchlist') {
            return topFuturesPairs;
        }
        const currentWatchlistIds = watchlists[activeWatchlist] || [];
        return futuresData.filter(crypto => currentWatchlistIds.includes(crypto.id));
    }, [activeWatchlist, watchlists, futuresData, topFuturesPairs, allFuturesData]);

    const isCustomWatchlist = activeWatchlist !== 'Top watchlist' && activeWatchlist !== 'All';

    return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
        <Header />
        <main className="flex-1 overflow-y-auto pb-20 p-4 space-y-6">
            <h1 className="text-2xl font-bold mt-4">Futures Market</h1>

            <div className="px-4">
                <div className="border-b border-border inline-block">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground whitespace-nowrap">
                        <Button variant="ghost" size="sm" onClick={() => setActiveWatchlist('All')} className={cn("px-3", activeWatchlist === 'All' && 'text-primary')}>
                            All
                        </Button>
                        {watchlistNames.map(watchlist => (
                            <Button
                                key={watchlist}
                                variant="ghost"
                                size="sm"
                                onClick={() => setActiveWatchlist(watchlist)}
                                className={cn("px-3", activeWatchlist === watchlist && 'text-primary')}
                            >
                                {watchlist}
                            </Button>
                        ))}
                         <Button variant="ghost" size="icon" onClick={handleAddWatchlist} className="w-8 h-8">
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
            
            {isCustomWatchlist && (
                <div className="p-4 space-y-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input 
                            placeholder="Search to add to watchlist..."
                            className="pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    {searchTerm && (
                        <Card>
                            <CardContent className="p-2 max-h-60 overflow-y-auto">
                                {searchResults.length > 0 ? searchResults.map(crypto => (
                                    <div key={crypto.id} className="flex items-center justify-between p-2 hover:bg-muted rounded-md">
                                        <div className="flex items-center gap-2">
                                            <crypto.icon className="w-6 h-6" />
                                            <div>
                                                <p className="font-semibold">{crypto.name}</p>
                                                <p className="text-xs text-muted-foreground">{crypto.symbol}</p>
                                            </div>
                                        </div>
                                        <Button size="sm" onClick={() => handleAddToWatchlist(crypto.id)}>Add</Button>
                                    </div>
                                )) : <p className="text-center text-muted-foreground p-4">No results found.</p>}
                            </CardContent>
                        </Card>
                    )}
                </div>
            )}
            
            {activeWatchlist === 'All' ? (
                 <div className="p-4">
                    <h2 className="flex items-center gap-2 text-lg font-semibold mb-4">
                        <Eye /> All Futures
                    </h2>
                    <div className="divide-y">
                        {loading ? <CryptoListSkeleton /> : <CryptoList cryptos={activeWatchlistCryptos} />}
                    </div>
                </div>
            ) : isCustomWatchlist ? (
                 <div className="p-4">
                    <h2 className="flex items-center gap-2 text-lg font-semibold mb-4"><Eye /> {activeWatchlist}</h2>
                    <div className="divide-y">
                        {loading ? <CryptoListSkeleton /> : activeWatchlistCryptos.length > 0 ? <CryptoList cryptos={activeWatchlistCryptos} /> : <p className="text-center text-muted-foreground p-4">This watchlist is empty. Use the search bar to add items.</p>}
                    </div>
                </div>
            ) : (
                <>
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
                </>
            )}


            <div className="p-4">
                <h2 className="flex items-center gap-2 text-lg font-semibold mb-4">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary"><path d="M3 17L9 11L13 15L21 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M14 7H21V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    Top Gainers & Losers
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
