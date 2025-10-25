
'use client';

import * as React from 'react';
import { CryptoCurrency } from '@/lib/types';
import { cn } from '@/lib/utils';
import Link from 'next/link';

type ExtendedCryptoCurrency = CryptoCurrency & { assetType?: 'Mutual Fund' | 'Crypto ETF' | 'Web3' };

const CryptoListItem = ({ crypto, tradeType }: { crypto: ExtendedCryptoCurrency, tradeType?: 'Spot' | 'Futures' | 'Funds & ETFs' | 'Web3' }) => {
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
    
    let path = `/crypto/${crypto.id}`; // Default path
    
    if (tradeType) {
        if (tradeType === 'Futures') {
            path = `/trade/futures/${crypto.id}`;
        } else if (tradeType === 'Funds & ETFs') {
            if (crypto.assetType === 'Mutual Fund') {
                path = `/trade/mutual-fund/${crypto.id}`;
            } else if (crypto.assetType === 'Crypto ETF') {
                path = `/trade/etf/${crypto.id}`;
            }
        } else if (tradeType === 'Web3') {
             path = `/trade/web3/${crypto.id}`;
        } else if (tradeType === 'Spot') {
            path = `/trade/${crypto.id}`;
        }
    } else {
        // Fallback for when tradeType is not provided (e.g. on web3 page before changes)
        // This is a simple heuristic. A more robust solution might involve checking the crypto's category/id.
        const web3Ids = ['singularitynet', 'apecoin', 'the-sandbox', 'decentraland', 'uniswap', 'pancakeswap-token'];
        if (web3Ids.includes(crypto.id)) {
            path = `/trade/web3/${crypto.id}`;
        }
    }

    return (
        <Link href={path}>
            {content}
        </Link>
    )
};

interface CryptoListProps {
    cryptos: ExtendedCryptoCurrency[];
    tradeType?: 'Spot' | 'Futures' | 'Funds & ETFs' | 'Web3';
}

export function CryptoList({ cryptos, tradeType }: CryptoListProps) {
    return (
        <>
            {cryptos.map(crypto => <CryptoListItem key={crypto.id} crypto={crypto} tradeType={tradeType} />)}
        </>
    );
}
