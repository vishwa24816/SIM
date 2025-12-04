
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Search, Sparkles, Paperclip, Mic, CornerDownLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BottomNav } from '@/components/dashboard/bottom-nav';
import { Header } from '@/components/dashboard/header';
import { useMarketData } from '@/hooks/use-market-data';
import { CryptoCurrency } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

const ScreenerListItem = ({
  crypto,
  rank,
}: {
  crypto: CryptoCurrency & { marketCap: number };
  rank: number;
}) => {
  const Icon = crypto.icon;
  const changeColor = crypto.change24h >= 0 ? 'text-green-500' : 'text-red-500';
  const price = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: crypto.price < 1 ? 6 : 2,
  }).format(crypto.price);

  const formatMarketData = (value: number) => {
    if (value >= 1_000_000_000) {
      return `₹${(value / 1_000_000_000).toFixed(2)}B`;
    }
    if (value >= 1_000_000) {
      return `₹${(value / 1_000_000).toFixed(2)}M`;
    }
    return `₹${value.toLocaleString()}`;
  };

  return (
    <div className="border-b">
      <Link href={`/crypto/${crypto.id}`} className="flex items-center p-4 cursor-pointer hover:bg-muted/50">
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


const MemoizedScreenerListItem = React.memo(ScreenerListItem);

export default function ScreenerPage() {
    const { marketData, loading } = useMarketData();
    const [activeTab, setActiveTab] = React.useState('AI Powered');
    const [chatInput, setChatInput] = React.useState('');
    const [aiPoweredList, setAiPoweredList] = React.useState<(CryptoCurrency & { marketCap: number })[] | null>(null);
    const [activePrompt, setActivePrompt] = React.useState<string | null>(null);
    
    const dataWithMarketCap = React.useMemo(() => {
        if (loading) return [];
        return marketData
            .filter(c => c.assetType !== 'Futures')
            .map(crypto => {
                const mockCirculatingSupply = (crypto.volume24h / crypto.price) * 10;
                const marketCap = crypto.price * (isNaN(mockCirculatingSupply) ? 1000000 : mockCirculatingSupply) ;
                return { ...crypto, marketCap: isNaN(marketCap) ? 0 : marketCap };
        });
    }, [marketData, loading]);

    const allCryptos = React.useMemo(() => dataWithMarketCap.sort((a, b) => b.marketCap - a.marketCap), [dataWithMarketCap]);
    const trendingCryptos = React.useMemo(() => [...dataWithMarketCap].sort((a, b) => b.volume24h - a.volume24h), [dataWithMarketCap]);
    const topGainers = React.useMemo(() => [...dataWithMarketCap].sort((a, b) => b.change24h - a.change24h), [dataWithMarketCap]);
    const topLosers = React.useMemo(() => [...dataWithMarketCap].sort((a, b) => a.change24h - b.change24h), [dataWithMarketCap]);

    const handlePromptClick = (prompt: string) => {
        setChatInput(prompt);
    };

    const handleChatSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!chatInput.trim()) return;

        setActivePrompt(chatInput);
        if (chatInput.toLowerCase().includes('gaining')) {
            setAiPoweredList(topGainers.slice(0, 10));
        } else if (chatInput.toLowerCase().includes('top crypto')) {
            setAiPoweredList(allCryptos.slice(0, 10));
        } else {
             const results = allCryptos.filter(crypto => 
                crypto.name.toLowerCase().includes(chatInput.toLowerCase()) || 
                crypto.symbol.toLowerCase().includes(chatInput.toLowerCase())
            );
            setAiPoweredList(results);
        }
    };

    const renderList = (data: (CryptoCurrency & { marketCap: number })[]) => {
      if (data.length === 0) {
        return (
          <div className="flex items-center justify-center h-48 text-muted-foreground">
              No assets match your criteria.
          </div>
        );
      }
      return (
        <div>
            {data.map((crypto, index) => (
                <MemoizedScreenerListItem key={crypto.id} crypto={crypto} rank={index + 1} />
            ))}
        </div>
      );
    }

    const currentList = React.useMemo(() => {
      switch (activeTab) {
        case 'Trending': return renderList(trendingCryptos);
        case 'Top Gainers': return renderList(topGainers);
        case 'Top Losers': return renderList(topLosers);
        case 'All': return renderList(allCryptos);
        case 'AI Powered':
            return (
                <div className="p-4 space-y-4">
                    <div className="text-center py-10">
                        <h2 className="text-2xl font-bold mb-2">Veda Screener</h2>
                        <p className="text-muted-foreground mb-6">Ask me anything about the crypto market.</p>
                    </div>
                    
                    <form onSubmit={handleChatSubmit} className="relative p-4 rounded-lg bg-card border">
                        <Textarea
                            placeholder="Type your message here..."
                            className="bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 resize-none pr-40 pl-0"
                            rows={1}
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                        />
                        <div className="absolute bottom-4 left-4 flex items-center gap-2">
                             <Button type="button" variant="ghost" size="icon" className="text-muted-foreground h-8 w-8">
                                <Paperclip className="w-5 h-5"/>
                            </Button>
                            <Button type="button" variant="ghost" size="icon" className="text-muted-foreground h-8 w-8">
                                <Mic className="w-5 h-5"/>
                            </Button>
                        </div>
                        <Button type="submit" className="absolute bottom-4 right-4 flex items-center gap-2">
                            Send Message <CornerDownLeft className="w-4 h-4"/>
                        </Button>
                    </form>
                    
                    <div className="flex justify-center gap-2 pt-4">
                        <Button variant="outline" size="sm" onClick={() => handlePromptClick('Top gaining cryptos')}>Top gaining cryptos</Button>
                        <Button variant="outline" size="sm" onClick={() => handlePromptClick('Top crypto')}>Top crypto</Button>
                    </div>

                    {aiPoweredList && (
                         <div className="pt-4">
                            {renderList(aiPoweredList)}
                         </div>
                    )}
                </div>
            );
        default:
          return renderList(allCryptos);
      }
    }, [activeTab, allCryptos, trendingCryptos, topGainers, topLosers, aiPoweredList, chatInput, activePrompt]);

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground">
            <Header />
            <main className="flex-1 overflow-y-auto pb-20">
              <div className="container mx-auto max-w-7xl px-0 sm:px-6 lg:px-8">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <div className="border-b">
                      <ScrollArea className="w-full whitespace-nowrap">
                        <TabsList className="p-0 h-auto bg-transparent m-4 inline-flex">
                          <TabsTrigger value="AI Powered" className="text-sm data-[state=active]:bg-muted data-[state=active]:text-primary flex items-center gap-2"><Sparkles className="w-4 h-4" /> AI Powered</TabsTrigger>
                          <TabsTrigger value="All" className="text-sm data-[state=active]:bg-muted data-[state=active]:text-primary">All</TabsTrigger>
                          <TabsTrigger value="Trending" className="text-sm data-[state=active]:bg-muted data-[state=active]:text-primary">Trending</TabsTrigger>
                          <TabsTrigger value="Top Gainers" className="text-sm data-[state=active]:bg-muted data-[state=active]:text-primary">Top Gainers</TabsTrigger>
                          <TabsTrigger value="Top Losers" className="text-sm data-[state=active]:bg-muted data-[state=active]:text-primary">Top Losers</TabsTrigger>
                        </TabsList>
                        <ScrollBar orientation="horizontal" />
                      </ScrollArea>
                    </div>
                    
                    <div className="p-4 hidden md:flex text-sm font-medium text-muted-foreground border-b">
                        <div className="w-8">#</div>
                        <div className="flex-1">Asset</div>
                        <div className="flex-1 text-right">Price</div>
                        <div className="flex-1 text-right">24h Volume</div>
                        <div className="w-10"></div>
                    </div>

                    {loading ? <ScreenerListSkeleton /> : (
                      <TabsContent value={activeTab} className="m-0">
                        {currentList}
                      </TabsContent>
                    )}

                </Tabs>
              </div>
            </main>
            <BottomNav />
        </div>
    );
}
