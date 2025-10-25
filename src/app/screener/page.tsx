'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { MoreVertical, Search, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BottomNav } from '@/components/dashboard/bottom-nav';
import { Header } from '@/components/dashboard/header';
import { useMarketData } from '@/hooks/use-market-data';
import { CryptoCurrency } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

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
    
    // Note: Prices are in USD from the API. The image shows INR (?), 
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

interface AIScreenerProps {
    aiQuery: string;
    setAiQuery: (query: string) => void;
    onRunScreener: () => void;
}

const AIScreener = ({ aiQuery, setAiQuery, onRunScreener }: AIScreenerProps) => {
    const presetFilters = [
        "Top 10 High Volume Crypto",
        "AI-related",
        "Crypto with market cap more than 100B"
    ];

    return (
        <Card className="m-4">
            <CardHeader>
                <div className="flex items-center gap-3">
                    <Zap className="w-6 h-6 text-primary" />
                    <div>
                        <CardTitle>AI Screener</CardTitle>
                         <p className="text-sm text-muted-foreground">Describe the assets you're looking for in plain English, or use a preset filter below.</p>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <Textarea 
                    className="min-h-[100px]"
                    value={aiQuery}
                    onChange={(e) => setAiQuery(e.target.value)}
                />
                <div className="flex flex-wrap gap-2">
                    {presetFilters.map(filter => (
                        <Button key={filter} variant="outline" size="sm" className="font-normal" onClick={() => setAiQuery(filter)}>
                            {filter}
                        </Button>
                    ))}
                </div>
                 <Button size="lg" className="w-full" onClick={onRunScreener}>
                    <Zap className="mr-2 h-4 w-4" />
                    Run Screener
                </Button>
            </CardContent>
        </Card>
    )
}

export default function ScreenerPage() {
    const { marketData, loading } = useMarketData();
    const [searchTerm, setSearchTerm] = React.useState('');
    const [activeTab, setActiveTab] = React.useState('AI');
    const [aiQuery, setAiQuery] = React.useState('');
    const [aiResults, setAiResults] = React.useState<CryptoCurrency[] | null>(null);
    const [aiSearchPerformed, setAiSearchPerformed] = React.useState(false);
    
    const aiIds = ['singularitynet'];

    const handleRunScreener = () => {
        setAiSearchPerformed(true);
        let results: CryptoCurrency[] = [];
        const lowerCaseQuery = aiQuery.toLowerCase();

        if (lowerCaseQuery.includes('high volume')) {
            results = [...marketData].sort((a,b) => b.volume24h - a.volume24h).slice(0, 10);
        } else if (lowerCaseQuery.includes('ai')) {
             results = marketData.filter(c => aiIds.includes(c.id));
        } else if (lowerCaseQuery.includes('market cap more than 100b')) {
            results = marketData.filter(c => {
                const marketCap = c.price * (c.volume24h / c.price); // Simplified market cap
                return marketCap > 100000000000;
            });
        } else {
             results = marketData.filter(c => c.name.toLowerCase().includes(lowerCaseQuery) || c.symbol.toLowerCase().includes(lowerCaseQuery));
        }
        setAiResults(results);
    };

    const filteredData = React.useMemo(() => {
        let data = [...marketData];
        if (activeTab === 'Trending Coins') {
            data = data.sort((a,b) => b.volume24h - a.volume24h);
        } else if (activeTab === 'Top Gainers') {
            data = data.sort((a, b) => b.change24h - a.change24h);
        } else if (activeTab === 'Top Losers') {
            data = data.sort((a, b) => a.change24h - b.change24h);
        } else if (activeTab === 'AI') {
            return []; // AI tab is now handled by AIScreener
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
             <div className="border-b border-border mt-4">
                <div className="overflow-x-auto px-4">
                    <div className="flex items-center gap-0 text-sm font-medium text-muted-foreground whitespace-nowrap">
                        {['AI', 'All', 'Trending Coins', 'Top Gainers', 'Top Losers'].map(tab => (
                             <Button 
                                key={tab} 
                                onClick={() => setActiveTab(tab)} 
                                variant="ghost" 
                                size="sm" 
                                className={cn("px-2", activeTab === tab && 'text-primary border-b-2 border-primary rounded-none')}>
                                {tab}
                             </Button>
                        ))}
                    </div>
                </div>
            </div>
           
            <div className="py-2">
                 {activeTab === 'AI' ? (
                    <>
                        <AIScreener aiQuery={aiQuery} setAiQuery={setAiQuery} onRunScreener={handleRunScreener} />
                        {aiSearchPerformed && (
                             <div className="p-4">
                                <h2 className="text-lg font-semibold mb-4">Screener Results</h2>
                                {loading ? (
                                    <div className="space-y-2">
                                        {[...Array(5)].map((_, i) => <CryptoRowSkeleton key={i} />)}
                                    </div>
                                ) : aiResults && aiResults.length > 0 ? (
                                     <div className="divide-y divide-border/50">
                                        {aiResults.map((crypto, index) => (
                                            <ScreenerListItem key={crypto.id} crypto={crypto} rank={index + 1} />
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-center text-muted-foreground p-4">No results found for your query.</p>
                                )}
                            </div>
                        )}
                    </>
                ) : loading ? (
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

    