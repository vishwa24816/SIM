'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BottomNav } from '@/components/dashboard/bottom-nav';
import { Header } from '@/components/dashboard/header';
import { useMarketData } from '@/hooks/use-market-data';
import { CryptoCurrency } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

const ScreenerListItem = ({
  crypto,
  rank,
}: {
  crypto: CryptoCurrency & { marketCap: number };
  rank: number;
}) => {
  const Icon = crypto.icon;
  const changeColor = crypto.change24h >= 0 ? 'text-green-500' : 'text-red-500';
  const price = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: crypto.price < 1 ? 6 : 2,
  }).format(crypto.price);

  const formatMarketData = (value: number) => {
    if (value > 1_000_000_000) {
      return `$${(value / 1_000_000_000).toFixed(2)}B`;
    }
    if (value > 1_000_000) {
      return `$${(value / 1_000_000).toFixed(2)}M`;
    }
    return `$${value.toLocaleString()}`;
  };

  return (
    <div className="border-b">
      <Link href={`/trade/${crypto.id}`} className="flex items-center p-4 cursor-pointer hover:bg-muted/50">
        <div className="w-8 text-sm text-muted-foreground">{rank}</div>
        <div className="flex-1 flex items-center gap-3">
          <Icon className="w-8 h-8" />
          <div>
            <p className="font-semibold">{crypto.symbol}</p>
            <p className="text-xs text-muted-foreground">{formatMarketData(crypto.marketCap)}</p>
          </div>
        </div>
        <div className="flex-1 text-right">
          <p className="font-semibold">{price}</p>
          <p className={cn('text-sm', changeColor)}>{crypto.change24h.toFixed(2)}%</p>
        </div>
        <div className="flex-1 text-right hidden md:block">
          <p className="font-semibold">{formatMarketData(crypto.volume24h)}</p>
          <p className="text-sm text-muted-foreground">24h Volume</p>
        </div>
        <div className="w-10 flex justify-end">
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </div>
      </Link>
    </div>
  );
};

const ScreenerListSkeleton = () => (
    <div className="space-y-2">
        {[...Array(10)].map((_, i) => (
            <div key={i} className="flex items-center p-4 space-x-4">
                <Skeleton className="w-8 h-4" />
                <Skeleton className="w-8 h-8 rounded-full" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-3 w-24" />
                </div>
                <div className="flex-1 space-y-2 items-end flex flex-col">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-3 w-12" />
                </div>
                <div className="flex-1 hidden md:flex md:flex-col md:items-end md:space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="w-10 h-10" />
            </div>
        ))}
    </div>
);


export default function ScreenerPage() {
    const { marketData, loading } = useMarketData();
    const [activeTab, setActiveTab] = React.useState('All');
    const [searchTerm, setSearchTerm] = React.useState('');

    const processedData = React.useMemo(() => {
        return marketData.map(crypto => {
            // Stable calculation for circulating supply and market cap
            const circulatingSupply = (crypto.volume24h / crypto.price) * 10; // Example stable factor
            const marketCap = crypto.price * circulatingSupply;
            return { ...crypto, marketCap };
        });
    }, [marketData]);

    const filteredData = React.useMemo(() => {
        if (!searchTerm) return processedData;
        return processedData.filter(
            crypto =>
                crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [processedData, searchTerm]);

    const trendingData = React.useMemo(() => [...filteredData].sort((a,b) => b.volume24h - a.volume24h), [filteredData]);
    const topGainers = React.useMemo(() => [...filteredData].sort((a,b) => b.change24h - a.change24h), [filteredData]);
    const topLosers = React.useMemo(() => [...filteredData].sort((a,b) => a.change24h - b.change24h), [filteredData]);
    
    const dataMap: { [key: string]: typeof processedData } = {
        'All': filteredData,
        'Trending': trendingData,
        'Top Gainers': topGainers,
        'Top Losers': topLosers,
    };
    
    const displayData = dataMap[activeTab];
    const navItems = ['All', 'Trending', 'Top Gainers', 'Top Losers'];

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground">
            <Header />
            <main className="flex-1 overflow-y-auto">
                <div className="sticky top-0 bg-background z-10 p-4 space-y-4 border-b">
                     <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input 
                            placeholder="Search asset..."
                            className="pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="overflow-x-auto">
                        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground whitespace-nowrap">
                            {navItems.map(item => (
                                 <Button key={item} onClick={() => setActiveTab(item)} variant="ghost" size="sm" className={cn("px-3", activeTab === item && 'text-primary bg-muted')}>
                                    {item}
                                 </Button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="p-4 hidden md:flex text-sm font-medium text-muted-foreground">
                    <div className="w-8">#</div>
                    <div className="flex-1">Asset</div>
                    <div className="flex-1 text-right">Price</div>
                    <div className="flex-1 text-right">24h Volume</div>
                    <div className="w-10"></div>
                </div>

                {loading ? <ScreenerListSkeleton /> : (
                    <div>
                        {displayData.map((crypto, index) => (
                            <ScreenerListItem key={crypto.id} crypto={crypto} rank={index + 1} />
                        ))}
                    </div>
                )}
                {displayData && displayData.length === 0 && !loading && (
                    <div className="flex items-center justify-center h-48 text-muted-foreground">
                        No assets found.
                    </div>
                )}
            </main>
            <BottomNav />
        </div>
    );
}