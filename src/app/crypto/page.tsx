
'use client';

import * as React from 'react';
import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Flame, Eye, ArrowUp, ArrowDown, Newspaper, Lightbulb, Plus, Search, Trash2 } from 'lucide-react';
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
import { Input } from '@/components/ui/input';
import { spotPairs } from '@/lib/pairs';
import { ADDITIONAL_FUNDS_ETFS_DATA } from '@/lib/data';
import { useSearchParams } from 'next/navigation';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"

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

function CryptoPageComponent() {
    const { marketData, loading } = useMarketData();
    const searchParams = useSearchParams();
    const initialTradeType = searchParams.get('type') || 'Spot';

    const [listType, setListType] = React.useState('Gainers');
    const [tradeType, setTradeType] = React.useState(initialTradeType);
    
    const [watchlists, setWatchlists] = React.useState<Record<string, string[]>>({ 'Top watchlist': [] });
    const [activeWatchlist, setActiveWatchlist] = React.useState('Top watchlist');
    const [searchTerm, setSearchTerm] = React.useState('');
    const [watchlistToRemove, setWatchlistToRemove] = React.useState<string | null>(null);

    const spotData = React.useMemo(() => marketData.filter(c => c.assetType === 'Spot'), [marketData]);
    
    const fundsAndETFsData: CryptoCurrency[] = React.useMemo(() => {
        if (loading) return [];
        const existingFunds = marketData.filter(c => c.assetType === 'Mutual Fund' || c.assetType === 'Crypto ETF');
        return [...existingFunds, ...ADDITIONAL_FUNDS_ETFS_DATA.map(f => ({ ...f, assetType: 'Crypto ETF' as const}))];
    }, [marketData, loading]);

    const displayData = tradeType === 'Spot' 
        ? spotData 
        : fundsAndETFsData;

    const trendingCrypto = [...displayData]
      .sort((a, b) => b.volume24h - a.volume24h)
      .slice(0, 5);
      
    const topCrypto = [...displayData]
      .sort((a,b) => (b.price * b.volume24h) - (a.price * a.volume24h))
      .slice(0, 8);
    
    const allSpotCryptos = React.useMemo(() => {
        return spotData.sort((a, b) => (b.price * b.volume24h) - (a.price * a.volume24h));
    }, [spotData]);

    const allFundsData = React.useMemo(() => {
        return fundsAndETFsData.sort((a, b) => (b.price * b.volume24h) - (a.price * a.volume24h));
    }, [fundsAndETFsData]);

    const topPairIds = ['bitcoin', 'ethereum', 'solana', 'cardano', 'ripple', 'dogecoin'];

    const topSpotPairs = React.useMemo(() => {
        return spotData.filter(c => topPairIds.includes(c.id));
    }, [spotData]);

    const gainers = [...displayData].sort((a, b) => b.change24h - a.change24h).slice(0, 5);
    const losers = [...displayData].sort((a, b) => a.change24h - b.change24h).slice(0, 5);

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

    const handleRemoveWatchlist = (name: string) => {
        if (name === 'Top watchlist') return;
        setWatchlistToRemove(name);
    }

    const confirmRemoveWatchlist = () => {
        if (!watchlistToRemove) return;
        setWatchlists(prev => {
            const newWatchlists = {...prev};
            delete newWatchlists[watchlistToRemove];
            return newWatchlists;
        });
        if (activeWatchlist === watchlistToRemove) {
            setActiveWatchlist('Top watchlist');
        }
        setWatchlistToRemove(null);
    }

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
        return displayData.filter(crypto =>
            crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, displayData]);

    const activeWatchlistCryptos = React.useMemo(() => {
        if (activeWatchlist === 'All') {
            return tradeType === 'Mutual Fund' ? allFundsData : allSpotCryptos;
        }
        if (activeWatchlist === 'Top watchlist') {
            return topCrypto;
        }
        const currentWatchlistIds = watchlists[activeWatchlist] || [];
        return displayData.filter(crypto => currentWatchlistIds.includes(crypto.id));
    }, [activeWatchlist, watchlists, displayData, topCrypto, allSpotCryptos, allFundsData, tradeType]);


    const isCustomWatchlist = activeWatchlist !== 'Top watchlist' && activeWatchlist !== 'All';

    return (
    <>
    <div className="flex flex-col min-h-screen bg-background text-foreground">
        <Header />
        <main className="flex-1 overflow-y-auto pb-20">
            <div className="px-4 mt-4">
                <div className="border-b border-border inline-block">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground whitespace-nowrap">
                        <Button onClick={() => setTradeType('Spot')} variant="ghost" size="sm" className={cn("px-3", tradeType === 'Spot' && 'text-primary')}>Spot</Button>
                        <Button onClick={() => setTradeType('Mutual Fund')} variant="ghost" size="sm" className={cn("px-3", tradeType === 'Mutual Fund' && 'text-primary')}>Funds &amp; ETFs</Button>
                    </div>
                </div>
            </div>
            
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
                                onDoubleClick={() => watchlist !== 'Top watchlist' && handleRemoveWatchlist(watchlist)}
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

            <div className="p-4 space-y-6">
                
                {activeWatchlist === 'All' ? (
                     <div className="p-4">
                        <h2 className="flex items-center gap-2 text-lg font-semibold mb-4">
                            <Eye /> {tradeType === 'Mutual Fund' ? 'All Funds' : 'All Cryptos'}
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
                            <h2 className="flex items-center gap-2 text-lg font-semibold mb-4"><Flame className="text-orange-500" /> Trending {tradeType}</h2>
                            <div className="divide-y">
                                {loading ? <CryptoListSkeleton /> : <CryptoList cryptos={trendingCrypto} />}
                            </div>
                        </div>

                        {tradeType === 'Spot' && (
                           <div className="p-4">
                                <h2 className="flex items-center gap-2 text-lg font-semibold mb-4"><Coins className="text-primary" /> Top Spot Pairs</h2>
                                <div className="divide-y">
                                    {loading ? <CryptoListSkeleton /> : <CryptoList cryptos={topSpotPairs} />}
                                </div>
                           </div>
                        )}
                    </>
                )}


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
      <AlertDialog open={!!watchlistToRemove} onOpenChange={() => setWatchlistToRemove(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the "{watchlistToRemove}" watchlist.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setWatchlistToRemove(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRemoveWatchlist} className="bg-destructive hover:bg-destructive/80">
                <Trash2 className="w-4 h-4 mr-2"/> Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
    );
}

export default function CryptoPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CryptoPageComponent />
        </Suspense>
    );
}
