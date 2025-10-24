
'use client';

import * as React from 'react';
import { CryptoCurrency } from '@/lib/types';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const CryptoListItem = ({ crypto, isTradePage }: { crypto: CryptoCurrency, isTradePage?: boolean }) => {
    const Icon = crypto.icon;
    const changeColor = crypto.change24h >= 0 ? 'text-green-500' : 'text-red-500';
    const price = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: crypto.price < 1 ? 6 : 2,
    }).format(crypto.price);

    const content = (
        <div className="flex items-center justify-between py-3 cursor-pointer">
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
    
    if (isTradePage) {
        return (
            <Link href={`/trade/${crypto.id}`} legacyBehavior>
                <a>{content}</a>
            </Link>
        )
    }

    return content;
};

interface CryptoListProps {
    cryptos: CryptoCurrency[];
    isTradePage?: boolean;
}

export function CryptoList({ cryptos, isTradePage }: CryptoListProps) {
    return (
        <>
            {cryptos.map(crypto => <CryptoListItem key={crypto.id} crypto={crypto} isTradePage={isTradePage} />)}
        </>
    );
}
