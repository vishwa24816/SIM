
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CryptoCurrency } from '@/lib/types';
import { Search, TrendingUp } from 'lucide-react';

const formatCurrency = (value: number, currency = 'USD', style = 'currency') => {
    if (style === 'currency') {
         return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(value);
    }
    return value.toLocaleString('en-US');
}

const formatLargeNumber = (value: number) => {
    if (value >= 1_000_000_000_000) {
        return `${(value / 1_000_000_000_000).toFixed(2)}T`;
    }
    if (value >= 1_000_000_000) {
        return `${(value / 1_000_000_000).toFixed(2)}B`;
    }
    if (value >= 1_000_000) {
        return `${(value / 1_000_000).toFixed(2)}M`;
    }
    return value.toLocaleString();
};


const PerformanceBar = ({ low, high, current }: { low: number; high: number; current: number }) => {
    const percentage = ((current - low) / (high - low)) * 100;
    return (
        <div className="w-full">
            <div className="h-2 bg-muted rounded-full w-full relative">
                <div className="h-2 bg-primary rounded-full" style={{ width: `${percentage}%` }}></div>
            </div>
            <div className="flex justify-between text-xs mt-1">
                <span>{formatCurrency(low)}</span>
                <span>{formatCurrency(high)}</span>
            </div>
        </div>
    );
};


export const CryptoTechnicals = ({ crypto }: { crypto: CryptoCurrency }) => {
    
    // Mocking some data that is not available in the API
    const marketCap = crypto.price * (crypto.volume24h / crypto.price * 10);
    const introYear = {
        'bitcoin': 2009,
        'ethereum': 2015,
        'dogecoin': 2013,
    }[crypto.id] || 2020;
    
    const technology = {
        'bitcoin': 'Proof-of-Work (PoW)',
        'ethereum': 'Proof-of-Stake (PoS)',
        'solana': 'Proof-of-History (PoH)',
    }[crypto.id] || 'Various';

    const marketRank = {
        'bitcoin': 1,
        'ethereum': 2,
    }[crypto.id] || 'N/A';

    const priceHistory24h = crypto.priceHistory.slice(-24);
    const low24h = Math.min(...priceHistory24h.map(p => p.value));
    const high24h = Math.max(...priceHistory24h.map(p => p.value));
    
    const priceHistory52w = crypto.priceHistory; // Assuming full history is 52w
    const low52w = Math.min(...priceHistory52w.map(p => p.value));
    const high52w = Math.max(...priceHistory52w.map(p => p.value));

    const openPrice = priceHistory24h[0]?.value ?? crypto.price;
    const prevClose = crypto.priceHistory[crypto.priceHistory.length-2]?.value ?? crypto.price;
    
    return (
        <div className="space-y-4">
             <Accordion type="multiple" defaultValue={['fundamentals', 'performance']} className="w-full">
                <AccordionItem value="fundamentals" className="border-none">
                    <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-2">
                           <Search className="h-5 w-5 text-muted-foreground" />
                           <h3 className="font-semibold text-card-foreground">Technicals</h3>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="grid grid-cols-2 gap-y-4 text-sm pt-4">
                            <div>
                                <p className="text-muted-foreground">Mkt Cap</p>
                                <p className="font-semibold">{formatLargeNumber(marketCap)}</p>
                            </div>
                             <div>
                                <p className="text-muted-foreground">Technology</p>
                                <p className="font-semibold">{technology}</p>
                            </div>
                             <div>
                                <p className="text-muted-foreground">Intro. Year</p>
                                <p className="font-semibold">{introYear}</p>
                            </div>
                             <div>
                                <p className="text-muted-foreground">Market Rank</p>
                                <p className="font-semibold">#{marketRank}</p>
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="performance" className="border-none">
                     <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-2">
                           <TrendingUp className="h-5 w-5 text-muted-foreground" />
                           <h3 className="font-semibold text-card-foreground">Performance</h3>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-6 pt-4">
                             <div>
                                <PerformanceBar low={low24h} high={high24h} current={crypto.price} />
                                <div className="flex justify-between text-xs mt-1">
                                    <span>Today's Low</span>
                                    <span>Today's High</span>
                                </div>
                            </div>
                             <div>
                                <PerformanceBar low={low52w} high={high52w} current={crypto.price} />
                                <div className="flex justify-between text-xs mt-1">
                                    <span>52 Week Low</span>
                                    <span>52 Week High</span>
                                </div>
                            </div>

                             <div className="grid grid-cols-2 gap-y-4 text-sm">
                                <div>
                                    <p className="text-muted-foreground">Open Price</p>
                                    <p className="font-semibold">{formatCurrency(openPrice)}</p>
                                </div>
                                 <div>
                                    <p className="text-muted-foreground">Prev. Close</p>
                                    <p className="font-semibold">{formatCurrency(prevClose)}</p>
                                </div>
                                 <div>
                                    <p className="text-muted-foreground">Volume (24H)</p>
                                    <p className="font-semibold">{formatLargeNumber(crypto.volume24h)}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Market Cap</p>
                                    <p className="font-semibold">{formatLargeNumber(marketCap)}</p>
                                </div>
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
};
