'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Flame, Eye, ArrowUp, ArrowDown, Newspaper, Lightbulb, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BottomNav } from '@/components/dashboard/bottom-nav';
import { Textarea } from '@/components/ui/textarea';
import { Header } from '@/components/dashboard/header';

const trendingCrypto = [
  { symbol: 'SHIB', name: 'Shiba Inu', price: '₹0.00', change: '+3.70%' },
  { symbol: 'DOGE', name: 'Dogecoin', price: '₹12.80', change: '+3.23%' },
  { symbol: 'XRP', name: 'XRP', price: '₹38.40', change: '+2.13%' },
  { symbol: 'TRX', name: 'TRON', price: '₹9.60', change: '+2.56%' },
  { symbol: 'USDC', name: 'USDCoin', price: '₹80.00', change: '+0.00%' },
];

const topCrypto = [
    { symbol: 'BTC', name: 'Crypto', price: '₹5,200,000.00', change: '+96040.00 (1.88%)', changeColor: 'text-green-500' },
    { symbol: 'ETH', name: 'Crypto', price: '₹272,000.00', change: '-4016.00 (-1.45%)', changeColor: 'text-red-500' },
    { symbol: 'USDT', name: 'Crypto', price: '₹80.00', change: '+0.00 (0.00%)', changeColor: 'text-muted-foreground' },
    { symbol: 'BNB', name: 'Crypto', price: '₹46,400.00', change: '+408.00 (0.89%)', changeColor: 'text-green-500' },
    { symbol: 'XRP', name: 'Crypto', price: '₹38.40', change: '+0.80 (2.13%)', changeColor: 'text-green-500' },
    { symbol: 'USDC', name: 'Crypto', price: '₹80.00', change: '+0.00 (0.00%)', changeColor: 'text-muted-foreground' },
    { symbol: 'ADA', name: 'Crypto', price: '₹36.00', change: '-0.80 (-2.17%)', changeColor: 'text-red-500' },
    { symbol: 'DOGE', name: 'Crypto', price: '₹12.80', change: '', changeColor: 'text-muted-foreground' },
];

const gainers = [
  { symbol: 'NOT', name: 'Notcoin', price: '₹1.60', change: '+25.00%' },
  { symbol: 'PEPE', name: 'Pepe', price: '₹0.00', change: '+18.87%' },
  { symbol: 'WIF', name: 'dogwithat', price: '₹280.00', change: '+14.75%' },
  { symbol: 'FLOKI', name: 'Floki', price: '₹0.02', change: '+12.00%' },
  { symbol: 'AGIX', name: 'SingularityNET', price: '₹70.00', change: '+9.20%' },
];

const CryptoListItem = ({ symbol, name, price, change, changeColor }: { symbol: string, name: string, price: string, change: string, changeColor?: string }) => (
    <div className="flex items-center justify-between py-3">
        <div className="flex items-center gap-3">
            <div className="bg-muted rounded-full w-10 h-10 flex items-center justify-center font-bold text-sm">
                {symbol.slice(0, 2)}
            </div>
            <div>
                <p className="font-semibold">{symbol}</p>
                <p className="text-xs text-muted-foreground">{name}</p>
            </div>
        </div>
        <div className="text-right">
            <p className="font-semibold">{price}</p>
            <p className={cn("text-xs", changeColor || (change.startsWith('+') ? 'text-green-500' : 'text-red-500'))}>{change}</p>
        </div>
    </div>
)


export default function CryptoPage() {
    const [activeTab, setActiveTab] = React.useState('Gainers');
  
    return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="border-b border-border -mx-4 px-4">
                <div className="overflow-x-auto">
                    <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground whitespace-nowrap">
                        <Button variant="ghost" className="text-primary px-3">Spot</Button>
                        <Button variant="ghost" className="px-3">Futures</Button>
                        <Button variant="ghost" className="px-3">Mutual Fund</Button>
                    </div>
                </div>
            </div>
            
            <div className="border-b border-border -mx-4 px-4">
                <div className="overflow-x-auto">
                    <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground whitespace-nowrap">
                        <Button variant="ghost" className="text-primary px-3">Top watchlist</Button>
                        <Button variant="ghost" className="px-3">Watchlist 1</Button>
                        <Button variant="ghost" className="px-3">Watchlist 2</Button>
                    </div>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg"><Flame className="text-orange-500" /> Trending Crypto</CardTitle>
                </CardHeader>
                <CardContent className="divide-y">
                    {trendingCrypto.map(crypto => <CryptoListItem key={crypto.symbol} {...crypto} />)}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg"><Eye /> Top Crypto</CardTitle>
                    <p className="text-sm text-muted-foreground">Tap items to view order page.</p>
                </CardHeader>
                <CardContent>
                    <div className="relative mb-4">
                        <Input placeholder="Enter symbol (e.g., RELIANCE, NIFTYJANFI)" className="pr-10" />
                        <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 text-primary">
                            <PlusCircle />
                        </Button>
                    </div>
                    <div className="divide-y">
                        {topCrypto.map(crypto => <CryptoListItem key={crypto.symbol} {...crypto} />)}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary"><path d="M3 17L9 11L13 15L21 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M14 7H21V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        Top Gainers & Losers
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex rounded-md bg-muted p-1 mb-4">
                        <Button onClick={() => setActiveTab('Gainers')} variant={activeTab === 'Gainers' ? 'default' : 'ghost'} className="flex-1 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
                            <ArrowUp className="mr-2 h-4 w-4 text-green-500"/> Gainers
                        </Button>
                        <Button onClick={() => setActiveTab('Losers')} variant={activeTab === 'Losers' ? 'default' : 'ghost'} className="flex-1 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
                            <ArrowDown className="mr-2 h-4 w-4 text-red-500"/> Losers
                        </Button>
                    </div>
                    <div className="divide-y">
                        {(activeTab === 'Gainers' ? gainers : []).map(crypto => <CryptoListItem key={crypto.symbol} {...crypto} />)}
                    </div>
                </CardContent>
            </Card>

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
        </main>
        <BottomNav />
    </div>
  );
}
