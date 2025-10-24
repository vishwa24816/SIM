
'use client';

import * as React from 'react';
import { CryptoCurrency } from '@/lib/types';
import { cn } from '@/lib/utils';

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

interface CryptoListProps {
    cryptos: CryptoCurrency[];
}

export function CryptoList({ cryptos }: CryptoListProps) {
    return (
        <>
            {cryptos.map(crypto => <CryptoListItem key={crypto.id} crypto={crypto} />)}
        </>
    );
}
