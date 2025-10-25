
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CryptoCurrency } from '@/lib/types';
import { Plus, Maximize } from 'lucide-react';
import { DonutChart } from '../ui/donut-chart';

const formatLargeNumber = (value: number) => {
    if (value >= 1_000_000_000_000) {
        return `₹${(value / 1_000_000_000_000).toFixed(2)}T`;
    }
    if (value >= 1_000_000_000) {
        return `₹${(value / 1_000_000_000).toFixed(2)}B`;
    }
    if (value >= 1_000_000) {
        return `₹${(value / 1_000_000).toFixed(2)}M`;
    }
    return `₹${value.toLocaleString()}`;
};

export const CryptoStudy = ({ crypto }: { crypto: CryptoCurrency }) => {
    const [showMore, setShowMore] = React.useState(false);

    // Mock data based on crypto
    const aboutCoin = {
        bitcoin: {
            launch: 'January 2009 by Satoshi Nakamoto',
            founded: '2008',
            purpose: 'To create a decentralized digital currency that enables peer-to-peer transactions without the need for intermediaries.',
            description: 'Bitcoin is a decentralized digital currency, without a central bank or single administrator, that can be sent from user to user on the peer-to-peer bitcoin network without the need for intermediaries. Transactions are verified by network nodes through cryptography and recorded in a public distributed ledger called a blockchain.'
        },
        ethereum: {
            launch: 'July 2015 by Vitalik Buterin & others',
            founded: '2014',
            purpose: 'To create a global, open-source platform for decentralized applications and smart contracts.',
            description: 'Ethereum is a decentralized, open-source blockchain with smart contract functionality. Ether (ETH) is the native cryptocurrency of the platform. Amongst cryptocurrencies, Ether is second only to Bitcoin in market capitalization.'
        },
    }[crypto.id] || {
        launch: 'N/A',
        founded: 'N/A',
        purpose: 'N/A',
        description: 'No detailed information available for this coin.'
    };

    const marketCap = crypto.price * (crypto.volume24h / crypto.price * 10);
    const marketShareData = [
        { name: crypto.symbol, value: 54.44, fill: 'var(--color-primary)' },
        { name: 'Others', value: 45.56, fill: 'var(--color-muted)' },
    ];
    
    const journeyData = [
        { year: '2011' }, { year: '2013' }, { year: '2016' }, 
        { year: '2017' }, { year: '2019' }, { year: '2021' }, { year: '2024' }
    ];

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>About Coin</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                    <div>
                        <p className="font-semibold">Launch</p>
                        <p className="text-muted-foreground">{aboutCoin.launch}</p>
                    </div>
                     <div>
                        <p className="font-semibold">Founded</p>
                        <p className="text-muted-foreground">{aboutCoin.founded}</p>
                    </div>
                     <div>
                        <p className="font-semibold">Purpose</p>
                        <p className="text-muted-foreground">{aboutCoin.purpose}</p>
                    </div>
                    {showMore && (
                        <div>
                            <p className="font-semibold">Description</p>
                            <p className="text-muted-foreground">{aboutCoin.description}</p>
                        </div>
                    )}
                    <Button variant="outline" className="w-full" onClick={() => setShowMore(!showMore)}>
                        {showMore ? 'Show Less' : 'Show More'}
                    </Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Market Capital</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-3xl font-bold mb-2">{formatLargeNumber(marketCap)}</p>
                    <div className="h-12 bg-gradient-to-t from-green-500/0 to-green-500/30 rounded-md"></div>
                </CardContent>
            </Card>

            <Card>
                 <CardHeader>
                    <CardTitle>Market Share</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-48">
                         <DonutChart data={marketShareData} />
                    </div>
                </CardContent>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle>Market Supply</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-24">
                   <p className="text-muted-foreground">Market supply data not available.</p>
                </CardContent>
            </Card>
            
            <Card className="bg-card-foreground text-background">
                <CardHeader className="flex flex-row justify-between items-center">
                    <CardTitle className="text-xl text-background">The Journey of {crypto.name}</CardTitle>
                    <Button variant="ghost" size="icon" className="text-background hover:bg-white/10 hover:text-background">
                        <Maximize className="h-5 w-5" />
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="h-40 flex items-end justify-between text-sm text-muted-foreground">
                        {journeyData.map((item, index) => (
                             <div key={item.year} className="flex flex-col items-center">
                                <div className="h-16 w-px bg-muted-foreground/50"></div>
                                <div className="h-2 w-2 rounded-full bg-primary my-1"></div>
                                <p>{item.year}</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader>
                    <CardTitle>Compare Coin</CardTitle>
                </CardHeader>
                 <CardContent className="flex items-center justify-around gap-2">
                    <div className="flex flex-col items-center text-center p-2 rounded-lg border">
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-1">
                            <crypto.icon className="w-6 h-6" />
                        </div>
                        <p className="font-semibold text-sm">{crypto.symbol}</p>
                        <p className="text-xs text-muted-foreground">{crypto.name}</p>
                    </div>
                    <span className="text-muted-foreground">vs</span>
                    <Button variant="outline" className="flex-col h-auto p-2 gap-1 border-dashed">
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                            <Plus className="h-5 w-5 text-muted-foreground" />
                        </div>
                         <p className="text-sm text-muted-foreground">Add Coin</p>
                    </Button>
                     <span className="text-muted-foreground">vs</span>
                     <Button variant="outline" className="flex-col h-auto p-2 gap-1 border-dashed">
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                            <Plus className="h-5 w-5 text-muted-foreground" />
                        </div>
                         <p className="text-sm text-muted-foreground">Add Coin</p>
                    </Button>
                </CardContent>
            </Card>

            <Card>
                 <CardHeader>
                    <CardTitle>Market Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                    <div className="flex justify-between">
                        <p className="text-muted-foreground">Coin Price</p>
                        <p className="font-semibold">{formatLargeNumber(crypto.price * 83)}</p>
                    </div>
                    <div className="flex justify-between">
                        <p className="text-muted-foreground">Market Capital</p>
                        <p className="font-semibold">{formatLargeNumber(marketCap * 83)}</p>
                    </div>
                     <div className="flex justify-between">
                        <p className="text-muted-foreground">Technology</p>
                        <p className="font-semibold text-right">Utilizes Proof-of-Work (PoW) consensus</p>
                    </div>
                    <div className="flex justify-between">
                        <p className="text-muted-foreground">Introduction Year</p>
                        <p className="font-semibold">2009</p>
                    </div>
                    <div className="flex justify-between">
                        <p className="text-muted-foreground">Tech Score Indicator</p>
                        <p className="font-semibold">88.2</p>
                    </div>
                    <div className="flex justify-between">
                        <p className="text-muted-foreground">Safety Score</p>
                        <p className="font-semibold">90</p>
                    </div>
                    <div className="flex justify-between">
                        <p className="text-muted-foreground">Market Rank</p>
                        <p className="font-semibold">1</p>
                    </div>
                     <div className="flex justify-between">
                        <p className="text-muted-foreground">6 Month Return</p>
                        <p className="font-semibold text-green-500">47.81%</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
