
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Flame, Eye, ArrowUp, ArrowDown, Newspaper, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BottomNav } from '@/components/dashboard/bottom-nav';
import { Textarea } from '@/components/ui/textarea';
import { Header } from '@/components/dashboard/header';
import { useMarketData } from '@/hooks/use-market-data';
import { CryptoCurrency } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

const CryptoListItem = ({ crypto }: { crypto: CryptoCurrency }) => {
    const Icon = crypto.icon;
    const changeColor = crypto.change24h >= 0 ? 'text-green-500' : 'text-red-500';
    const price = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: crypto.price < 1 ? 6 : 2,
    }).format(crypto.price);

    return (
        <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
                <div className="bg-muted rounded-full w-10 h-10 flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                </div>
                <div>
                    <p className="font-semibold">{crypto.symbol}</p>
                    <p className="text-xs text-muted-foreground">{crypto.name}</p>
                </div>
            </div>
            <div className="text-right">
                <p className="font-semibold">{price}</p>
                <p className={cn("text-xs", changeColor)}>{crypto.change24h.toFixed(2)}%</p>
            </div>
        </div>
    );
};

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


export default function CryptoPage() {
    const { marketData, loading } = useMarketData();
    const [activeTab, setActiveTab] = React.useState('Gainers');

    const trendingIds = ['shiba-inu', 'dogecoin', 'ripple', 'tron', 'usd-coin'];
    const topIds = ['bitcoin', 'ethereum', 'tether', 'binancecoin', 'ripple', 'usd-coin', 'cardano', 'dogecoin'];

    const trendingCrypto = marketData.filter(c => trendingIds.includes(c.id));
    const topCrypto = marketData.filter(c => topIds.includes(c.id));

    const gainers = [...marketData].sort((a, b) => b.change24h - a.change24h).slice(0, 5);
    const losers = [...marketData].sort((a, b) => a.change24h - b.change24h).slice(0, 5);


    return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
        <Header />
        <main className="flex-1 overflow-y-auto">
            <div className="border-b border-border">
                <div className="overflow-x-auto px-4">
                    <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground whitespace-nowrap">
                        <Button variant="ghost" size="sm" className="text-primary px-3">Spot</Button>
                        <Button variant="ghost" size="sm" className="px-3">Futures</Button>
                        <Button variant="ghost" size="sm" className="px-3">Mutual Fund</Button>
                    </div>
                </div>
            </div>
            
            <div className="border-b border-border">
                <div className="overflow-x-auto px-4">
                    <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground whitespace-nowrap">
                        <Button variant="ghost" size="sm" className="text-primary px-3">Top watchlist</Button>
                        <Button variant="ghost" size="sm" className="px-3">Watchlist 1</Button>
                        <Button variant="ghost" size="sm" className="px-3">Watchlist 2</Button>
                    </div>
                </div>
            </div>

            <div className="p-4 space-y-6">
                <div>
                    <h2 className="flex items-center gap-2 text-lg font-semibold mb-4"><Flame className="text-orange-500" /> Trending Crypto</h2>
                    <div className="divide-y">
                        {loading ? <CryptoListSkeleton /> : trendingCrypto.map(crypto => <CryptoListItem key={crypto.id} crypto={crypto} />)}
                    </div>
                </div>

                <div>
                    <h2 className="flex items-center gap-2 text-lg font-semibold mb-2"><Eye /> Top Crypto</h2>
                    <div className="divide-y">
                        {loading ? <CryptoListSkeleton /> : topCrypto.map(crypto => <CryptoListItem key={crypto.id} crypto={crypto} />)}
                    </div>
                </div>

                <div>
                    <h2 className="flex items-center gap-2 text-lg font-semibold mb-4">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary"><path d="M3 17L9 11L13 15L21 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M14 7H21V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        Top Gainers &amp; Losers
                    </h2>
                    <div className="flex rounded-md bg-muted p-1 mb-4">
                        <Button onClick={() => setActiveTab('Gainers')} variant={activeTab === 'Gainers' ? 'default' : 'ghost'} className="flex-1 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
                            <ArrowUp className="mr-2 h-4 w-4 text-green-500"/> Gainers
                        </Button>
                        <Button onClick={() => setActiveTab('Losers')} variant={activeTab === 'Losers' ? 'default' : 'ghost'} className="flex-1 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
                            <ArrowDown className="mr-2 h-4 w-4 text-red-500"/> Losers
                        </Button>
                    </div>
                    <div className="divide-y">
                         {loading ? <CryptoListSkeleton /> : (activeTab === 'Gainers' ? gainers : losers).map(crypto => <CryptoListItem key={crypto.id} crypto={crypto} />)}
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
