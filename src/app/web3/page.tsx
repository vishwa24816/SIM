
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Search, Flame, Eye, ArrowUp, ArrowDown, Newspaper, Lightbulb, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BottomNav } from '@/components/dashboard/bottom-nav';
import { Textarea } from '@/components/ui/textarea';
import { Header } from '@/components/dashboard/header';
import { useMarketData } from '@/hooks/use-market-data';
import { CryptoCurrency } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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


export default function Web3Page() {
    const { marketData, loading } = useMarketData();
    const [listType, setListType] = React.useState('Gainers');
    const [viewType, setViewType] = React.useState('AI');
    const [watchlists, setWatchlists] = React.useState(['Top watchlist']);
    const [activeWatchlist, setActiveWatchlist] = React.useState('Top watchlist');
    
    const aiData = React.useMemo(() => marketData.filter(c => ['singularitynet'].includes(c.id)), [marketData]);

    const nftData = React.useMemo(() => marketData.filter(c => ['apecoin', 'the-sandbox', 'decentraland'].includes(c.id)), [marketData]);
    
    const dexData = React.useMemo(() => marketData.filter(c => ['uniswap', 'pancakeswap-token'].includes(c.id)), [marketData]);
    

    const viewMap: {[key: string]: CryptoCurrency[]} = {
        'AI': aiData,
        'NFT': nftData,
        'DEX': dexData,
    }

    const displayData = viewMap[viewType];

    const trendingCrypto = [...displayData]
      .sort((a, b) => b.volume24h - a.volume24h)
      .slice(0, 5);
      
    const topCrypto = [...displayData]
      .sort((a,b) => (b.price * b.volume24h) - (a.price * a.volume24h))
      .slice(0, 8);

    const gainers = [...displayData].sort((a, b) => b.change24h - a.change24h).slice(0, 5);
    const losers = [...displayData].sort((a, b) => a.change24h - b.change24h).slice(0, 5);

    const listMap = {
        'Gainers': gainers,
        'Losers': losers,
    };

    const activeList = listMap[listType as keyof typeof listMap];

    const navItems = ['AI', 'NFT', 'DEX'];

    const handleAddWatchlist = () => {
        const newWatchlistName = `Watchlist ${watchlists.length}`;
        setWatchlists([...watchlists, newWatchlistName]);
        setActiveWatchlist(newWatchlistName);
    };

    return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
        <Header />
        <main className="flex-1 overflow-y-auto">
            <div className="border-b border-border">
                <div className="overflow-x-auto px-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground whitespace-nowrap">
                        {navItems.map(item => (
                             <Button key={item} onClick={() => setViewType(item)} variant="ghost" size="sm" className={cn("px-3", viewType === item && 'text-primary')}>{item}</Button>
                        ))}
                    </div>
                </div>
            </div>
            
            <div className="border-b border-border">
                <div className="overflow-x-auto px-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground whitespace-nowrap">
                        {watchlists.map(watchlist => (
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

            <div className="p-4 space-y-6">
                <div className="p-4">
                    <h2 className="flex items-center gap-2 text-lg font-semibold mb-4"><Flame className="text-orange-500" /> Trending {viewType}</h2>
                    <div className="divide-y">
                        {loading ? <CryptoListSkeleton /> : <CryptoList cryptos={trendingCrypto} />}
                    </div>
                </div>

                <div className="p-4">
                    <h2 className="flex items-center gap-2 text-lg font-semibold mb-2"><Eye /> Top {viewType}</h2>
                    <div className="divide-y">
                        {loading ? <CryptoListSkeleton /> : <CryptoList cryptos={topCrypto} />}
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

                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <Newspaper className="w-6 h-6 text-primary" />
                            <div>
                                <CardTitle>Top Market News</CardTitle>
                                <p className="text-sm text-muted-foreground">Latest headlines relevant to your view and AI-powered summaries.</p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Recent Headlines</h3>
                            <div className="flex items-center justify-center h-24 rounded-lg bg-secondary/50">
                                <p className="text-muted-foreground">No news relevant to this stock found.</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-3 mb-4">
                            <Lightbulb className="w-6 h-6 text-yellow-400" />
                            <h3 className="text-lg font-semibold">AI News Summary</h3>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Textarea 
                            placeholder="Enter news headlines here, one per line..."
                            className="bg-secondary/50 min-h-[100px]"
                        />
                    </CardContent>
                </Card>
            </div>
        </main>
        <BottomNav />
    </div>
  );
}
