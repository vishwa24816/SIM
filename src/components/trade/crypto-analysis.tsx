
'use client';

import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CryptoCurrency } from '@/lib/types';
import { ArrowRight, ArrowUp, ArrowDown, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BitcoinIcon } from '../icons';

const AnalysisCard = ({ title, children, status, arrow = true }: { title: string, children: React.ReactNode, status?: string, arrow?: boolean }) => (
    <Card>
        <CardContent className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-card-foreground">{title}</h3>
                <div className="flex items-center gap-2">
                    {status && <Badge variant="outline" className={cn(
                        status.toLowerCase() === 'bullish' && 'bg-green-500/10 text-green-500 border-green-500/30',
                        status.toLowerCase() === 'promising' && 'bg-green-500/10 text-green-500 border-green-500/30',
                        status.toLowerCase() === 'neutral' && 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30'
                    )}>{status}</Badge>}
                    {arrow && <ArrowRight className="h-4 w-4 text-muted-foreground" />}
                </div>
            </div>
            {children}
        </CardContent>
    </Card>
);

const SentimentGauge = () => {
    const [timeframe, setTimeframe] = React.useState('24 Hrs');
    const timeframes = ['12 Hrs', '24 Hrs', 'Weekly', 'Monthly'];
    return (
        <Card>
            <CardContent className="p-4 flex flex-col items-center">
                 <div className="w-full max-w-[200px] aspect-square relative">
                    <svg viewBox="0 0 100 50" className="w-full">
                        <defs>
                            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#ef4444" />
                                <stop offset="50%" stopColor="#f97316" />
                                <stop offset="100%" stopColor="#22c55e" />
                            </linearGradient>
                        </defs>
                        <path d="M 10 50 A 40 40 0 0 1 90 50" stroke="url(#gaugeGradient)" strokeWidth="10" fill="none" strokeLinecap="round" />
                        <circle cx="50" cy="50" r="3" fill="currentColor" />
                        <line x1="50" y1="50" x2="20" y2="28" stroke="currentColor" strokeWidth="2" transform="rotate(20 50 50)" />
                    </svg>
                    <div className="absolute bottom-0 text-center w-full">
                        <p className="font-bold text-lg text-green-500">SLIGHTLY BULLISH</p>
                    </div>
                </div>
                <div className="flex gap-2 mt-4">
                    {timeframes.map(tf => (
                        <Button
                            key={tf}
                            variant={timeframe === tf ? 'secondary' : 'ghost'}
                            size="sm"
                            onClick={() => setTimeframe(tf)}
                            className="rounded-full text-xs"
                        >
                            {tf}
                        </Button>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}


export const CryptoAnalysis = ({ crypto }: { crypto: CryptoCurrency }) => {
    return (
        <div className="space-y-4">
            <SentimentGauge />

            <AnalysisCard title="Tech Analysis" status="Bullish">
                <div className="flex items-end justify-between">
                    <p className="text-4xl font-bold">75%</p>
                    <TrendingUp className="h-16 w-16 text-green-500" />
                </div>
                <p className="text-sm text-muted-foreground">24 Hrs</p>
            </AnalysisCard>
            
            <AnalysisCard title="News Sentiment" status="Promising">
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                        <span>Positive</span>
                        <div className="flex items-center gap-2 px-2 py-1 rounded text-green-600 bg-green-500/10">
                            <ArrowUp className="h-3 w-3" />
                            <span>61.3%</span>
                        </div>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>Negative</span>
                         <div className="flex items-center gap-2 px-2 py-1 rounded text-red-600 bg-red-500/10">
                            <ArrowDown className="h-3 w-3" />
                            <span>21.1%</span>
                        </div>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>Neutral</span>
                         <div className="flex items-center gap-2 px-2 py-1 rounded text-yellow-600 bg-yellow-500/10">
                            <div className="h-2 w-2 rounded-full bg-yellow-500" />
                            <span>17.6%</span>
                        </div>
                    </div>
                </div>
                 <p className="text-sm text-muted-foreground mt-4">24 Hrs</p>
            </AnalysisCard>
            
            <AnalysisCard title="Coin Fundamental">
                 <div className="space-y-4">
                    <Button variant="ghost" className="text-primary p-0 h-auto gap-2">
                        <BitcoinIcon className="h-4 w-4" /> About Coin
                    </Button>
                    <div>
                        <p className="text-4xl font-bold">#1 <span className="text-base font-normal text-muted-foreground">Market Cap Rank</span></p>
                    </div>
                    <div className="text-sm space-y-1">
                        <p>Market Cap : <span className="font-semibold text-card-foreground">2.37T</span></p>
                        <p>Circulating Supply : <span className="font-semibold text-card-foreground">19.9M</span></p>
                    </div>
                     <div>
                        <p className="font-semibold text-card-foreground mb-1">Category</p>
                        <Badge>Payment Currency</Badge>
                        <p className="text-xs text-muted-foreground mt-1">The Bitcoin is widely accepted as a Payment Currency</p>
                    </div>
                </div>
            </AnalysisCard>

            <AnalysisCard title="Industry Factor" status="Bullish">
                 <div className="space-y-1">
                    <p className="text-3xl font-bold">36.3K</p>
                    <p className="text-sm text-green-500 flex items-center"><ArrowUp className="h-4 w-4" /> 3.35K</p>
                    <p className="text-xs text-muted-foreground">Total News</p>
                 </div>
            </AnalysisCard>
            
            <AnalysisCard title="Popularity Index" status="Neutral">
                <div className="space-y-1">
                    <p className="text-4xl font-bold">#1</p>
                    <p className="text-sm text-muted-foreground">News Rank</p>
                </div>
            </AnalysisCard>

        </div>
    );
};
