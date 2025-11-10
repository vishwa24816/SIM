
'use client';

import * as React from 'react';
import { TradingPair } from '@/lib/pairs';
import { useMarketData } from '@/hooks/use-market-data';
import { Skeleton } from '../ui/skeleton';
import { cn } from '@/lib/utils';
import { Badge } from '../ui/badge';
import { Coins } from 'lucide-react';

interface TopPairsListProps {
  title: string;
  pairs: TradingPair[];
}

const PairRow = ({ pair, price }: { pair: TradingPair, price?: number }) => {
    return (
        <div className="flex items-center justify-between py-2 px-4 text-sm hover:bg-muted/50 rounded-md">
            <div className="flex-1 font-semibold">{pair.pair}</div>
            <div className="flex-1 text-center">{pair.baseAsset}</div>
            <div className="flex-1 text-center">{price ? `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}` : <Skeleton className="h-4 w-20 mx-auto" />}</div>
            <div className="flex-1 text-right">
                <Badge variant={pair.status.toLowerCase() === 'trading' || pair.status.toLowerCase() === 'active' ? 'default' : 'secondary'} className={cn(
                    pair.status.toLowerCase() === 'trading' || pair.status.toLowerCase() === 'active' ? 'bg-green-500/20 text-green-500 border-green-500/30' : ''
                )}>
                    {pair.status}
                </Badge>
            </div>
        </div>
    );
};

export function TopPairsList({ title, pairs }: TopPairsListProps) {
    const { marketData, loading } = useMarketData();
    
    const baseAssets = React.useMemo(() => new Set(pairs.map(p => p.baseAsset)), [pairs]);
    
    const priceMap = React.useMemo(() => {
        const map = new Map<string, number>();
        marketData.forEach(crypto => {
            if (baseAssets.has(crypto.symbol)) {
                map.set(crypto.symbol, crypto.price);
            }
        });
        return map;
    }, [marketData, baseAssets]);


    return (
        <div>
            <h2 className="flex items-center gap-2 text-lg font-semibold mb-4">
                <Coins className="text-primary" /> {title}
            </h2>
            <div className="p-2 border rounded-lg">
                <div className="flex items-center justify-between py-2 px-4 text-xs font-medium text-muted-foreground border-b">
                    <div className="flex-1">Pair</div>
                    <div className="flex-1 text-center">Asset</div>
                    <div className="flex-1 text-center">Price</div>
                    <div className="flex-1 text-right">Status</div>
                </div>
                <div className="divide-y">
                    {loading ? (
                        Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="flex items-center justify-between py-2 px-4">
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-4 w-10" />
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-6 w-16" />
                            </div>
                        ))
                    ) : (
                        pairs.map(pair => (
                            <PairRow key={`${pair.exchange}-${pair.pair}`} pair={pair} price={priceMap.get(pair.baseAsset)} />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
