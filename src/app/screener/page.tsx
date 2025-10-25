'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { MoreVertical, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BottomNav } from '@/components/dashboard/bottom-nav';
import { Header } from '@/components/dashboard/header';
import { useMarketData } from '@/hooks/use-market-data';
import { CryptoCurrency } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';

const CryptoRowSkeleton = () => (
    <div className="flex items-center justify-between py-3 px-4 border-b">
        <div className="flex items-center gap-3">
            <Skeleton className="w-4 h-4" />
            <Skeleton className="w-10 h-10 rounded-full" />
            <div>
                <Skeleton className="h-4 w-20 mb-1" />
                <Skeleton className="h-3 w-24" />
            </div>
        </div>
        <div className="text-right">
            <Skeleton className="h-4 w-24 mb-1" />
            <Skeleton className="h-3 w-16 ml-auto" />
            <Skeleton className="h-3 w-20 mt-1 ml-auto" />
        </div>
    </div>
);


const ScreenerListItem = ({ crypto, rank }: { crypto: CryptoCurrency, rank: number }) => {
    const Icon = crypto.icon;
    const changeColor = crypto.change24h >= 0 ? 'text-green-500' : 'text-red-500';
    
    // Note: Prices are in USD from the API. The image shows INR (₹), 
    // but for this simulation, we'll display USD with a $ prefix.
    const price = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: crypto.price < 1 ? 6 : 2,
    }).format(crypto.price);

    const volume = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        notation: 'compact',
    }).format(crypto.volume24h);

    const marketCap = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        notation: 'compact',
    }).format(crypto.price * (crypto.volume24h / crypto.price)); // A simplified market cap calculation

    return (
         <div className="flex items-center justify-between py-3 px-4 border-b border-border/50">
            <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground w-4 text-center">{rank}</span>
                <div className="bg-muted rounded-full w-10 h-10 flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                </div>
                <div>
                    <p className="font-bold text-base">{crypto.symbol}</p>
                    <p className="text-xs text-muted-foreground">Mkt. Cap: {marketCap}</p>
                </div>
            </div>
            <div className="text-right flex items-center">
                 <div className='mr-4'>
                    <p className="font-semibold">{price}</p>
                    <p className={cn("text-xs font-semibold", changeColor)}>{crypto.change24h >= 0 && '+'}{crypto.change24h.toFixed(2)}%</p>
                    <p className="text-xs text-muted-foreground mt-1">Vol (24h): {volume}</p>
                 </div>
                 <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-5 w-5" />
                 </Button>
            </div>
        </div>
    );
}

export default function ScreenerPage() {
    const { marketData, loading } = useMarketData();
    const [searchTerm, setSearchTerm] = React.useState('');
    const [activeTab, setActiveTab] = React.useState('All');

    const filteredData = React.useMemo(() => {
        let data = [...marketData];
        if (activeTab === 'Trending Coins') {
            data = data.sort((a,b) => b.volume24h - a.volume24h);
        } else if (activeTab === 'Top Gainers') {
            data = data.sort((a, b) => b.change24h - a.change24h);
        } else if (activeTab === 'Top Losers') {
            data = data.sort((a, b) => a.change24h - b.change24h);
        }

        if (searchTerm) {
            return data.filter(c => 
                c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                c.symbol.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        return data;
    }, [marketData, searchTerm, activeTab]);

    return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
        <Header />
        <main className="flex-1 overflow-y-auto">
            <div className="p-4 bg-primary/95">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary-foreground/50" />
                    <Input
                        type="search"
                        placeholder="Search crypto, spot, future..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/50 border-none focus:ring-2 focus:ring-primary-foreground"
                    />
                </div>
            </div>
            
             <div className="border-b border-border">
                <div className="overflow-x-auto px-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground whitespace-nowrap">
                        {['All', 'Trending Coins', 'Top Gainers', 'Top Losers'].map(tab => (
                             <Button 
                                key={tab} 
                                onClick={() => setActiveTab(tab)} 
                                variant="ghost" 
                                size="sm" 
                                className={cn("px-3", activeTab === tab && 'text-primary border-b-2 border-primary rounded-none')}>
                                {tab}
                             </Button>
                        ))}
                    </div>
                </div>
            </div>
           
            <div className="py-2">
                {loading ? (
                    <div className="space-y-2">
                        {[...Array(10)].map((_, i) => <CryptoRowSkeleton key={i} />)}
                    </div>
                ) : (
                    <div className="divide-y divide-border/50">
                        {filteredData.map((crypto, index) => (
                            <ScreenerListItem key={crypto.id} crypto={crypto} rank={index + 1} />
                        ))}
                    </div>
                )}
            </div>

        </main>
        <BottomNav />
    </div>
  );
}
