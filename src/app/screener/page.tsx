'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Search, Sparkles, Wand2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BottomNav } from '@/components/dashboard/bottom-nav';
import { Header } from '@/components/dashboard/header';
import { useMarketData } from '@/hooks/use-market-data';
import { CryptoCurrency } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { getAiScreenedCryptos } from '../actions';

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
    if (value >= 1_000_000_000) {
      return `$${(value / 1_000_000_000).toFixed(2)}B`;
    }
    if (value >= 1_000_000) {
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
    const [prompt, setPrompt] = React.useState('');
    const [isAiLoading, setIsAiLoading] = React.useState(false);
    const [aiFilteredIds, setAiFilteredIds] = React.useState<string[] | null>(null);

    const examplePrompts = [
      "Newly trending meme coins",
      "AI tokens with high volume",
      "Undervalued DeFi assets",
      "Coins with recent positive news",
    ];

    const handleRunScreener = async () => {
        setIsAiLoading(true);
        const resultIds = await getAiScreenedCryptos(prompt, marketData);
        setAiFilteredIds(resultIds);
        setIsAiLoading(false);
    }
    
    const processedData = React.useMemo(() => {
        if (loading) return [];
        const dataWithMarketCap = marketData.map(crypto => {
            const circulatingSupply = crypto.volume24h / crypto.price;
            const marketCap = crypto.price * circulatingSupply;
            return { ...crypto, marketCap };
        }).sort((a, b) => b.marketCap - a.marketCap);

        if (aiFilteredIds) {
            const filteredSet = new Set(aiFilteredIds);
            return dataWithMarketCap.filter(c => filteredSet.has(c.id));
        }

        return dataWithMarketCap;
    }, [marketData, loading, aiFilteredIds]);


    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground">
            <Header />
            <main className="flex-1 overflow-y-auto">
                <div className="p-4 space-y-4 border-b">
                    <Card className="bg-gradient-to-br from-primary/10 to-background">
                        <CardContent className="p-4 space-y-4">
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-6 h-6 text-primary"/>
                                <h2 className="text-lg font-semibold">AI Powered Screener</h2>
                            </div>
                            <Textarea 
                                placeholder="e.g., 'Show me AI coins with high 24h volume'"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                className="bg-background/50"
                            />
                            <div className="flex flex-wrap gap-2">
                                {examplePrompts.map((p, i) => (
                                    <Button key={i} variant="outline" size="sm" onClick={() => setPrompt(p)}>
                                        {p}
                                    </Button>
                                ))}
                            </div>
                             <Button onClick={handleRunScreener} disabled={isAiLoading || !prompt} className="w-full">
                                <Wand2 className="w-4 h-4 mr-2" />
                                {isAiLoading ? 'Analyzing...' : 'Run Screener'}
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                <div className="p-4 hidden md:flex text-sm font-medium text-muted-foreground">
                    <div className="w-8">#</div>
                    <div className="flex-1">Asset</div>
                    <div className="flex-1 text-right">Price</div>
                    <div className="flex-1 text-right">24h Volume</div>
                    <div className="w-10"></div>
                </div>

                {(loading || isAiLoading) ? <ScreenerListSkeleton /> : (
                    <div>
                        {processedData.map((crypto, index) => (
                            <ScreenerListItem key={crypto.id} crypto={crypto} rank={index + 1} />
                        ))}
                    </div>
                )}
                {processedData.length === 0 && !loading && !isAiLoading && (
                    <div className="flex items-center justify-center h-48 text-muted-foreground">
                        No assets match your criteria.
                    </div>
                )}
            </main>
            <BottomNav />
        </div>
    );
}
