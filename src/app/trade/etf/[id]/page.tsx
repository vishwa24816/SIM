
'use client';

import * as React from 'react';
import { useMarketData } from '@/hooks/use-market-data';
import { PriceChart } from '@/components/dashboard/price-chart';
import { OrderPageHeader } from '@/components/trade/order-page-header';
import { OrderForm } from '@/components/trade/order-form';
import { Skeleton } from '@/components/ui/skeleton';
import { BottomNav } from '@/components/dashboard/bottom-nav';
import { Separator } from '@/components/ui/separator';
import { CRYPTO_ETFS_DATA } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ETFTradePage({ params }: { params: { id: string } }) {
  const { loading: marketLoading } = useMarketData();
  
  const [price, setPrice] = React.useState('');
  const [orderType, setOrderType] = React.useState('limit');

  const etf = React.useMemo(() => {
    return CRYPTO_ETFS_DATA.find(e => e.id === params.id);
  }, [params.id]);

  const cryptoEquivalent = React.useMemo(() => {
    if (!etf) return undefined;
    return { ...etf };
  }, [etf]);

  React.useEffect(() => {
    if (etf) {
        setPrice(etf.price.toFixed(2));
    }
    if (orderType === 'market' && etf) {
        setPrice(etf.price.toFixed(2));
    }
  }, [etf, orderType]);

  if (marketLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <OrderPageHeader crypto={undefined} loading={true} />
        <main className="flex-1 overflow-y-auto p-4 space-y-4">
          <Skeleton className="h-[300px] w-full" />
          <Skeleton className="h-[400px] w-full" />
          <Skeleton className="h-[200px] w-full" />
        </main>
        <BottomNav />
      </div>
    );
  }

  if (!etf || !cryptoEquivalent) {
    return (
      <div className="flex flex-col min-h-screen bg-background text-foreground">
         <OrderPageHeader crypto={undefined} />
        <main className="flex-1 flex items-center justify-center">
          <p>ETF not found.</p>
        </main>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <OrderPageHeader crypto={cryptoEquivalent} />
      <main className="flex-1 overflow-y-auto p-4 space-y-6">
        <PriceChart crypto={cryptoEquivalent} loading={marketLoading} />
        <Separator className="bg-border/50" />
        <OrderForm
          crypto={cryptoEquivalent}
          price={price}
          setPrice={setPrice}
          orderType={orderType}
          setOrderType={setOrderType}
        />
        <Separator className="bg-border/50" />
        <Card>
            <CardHeader>
                <CardTitle>About {etf.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
                <p className="text-muted-foreground">{etf.description}</p>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="font-semibold">Issuer</p>
                        <p className="text-muted-foreground">{etf.issuer}</p>
                    </div>
                     <div>
                        <p className="font-semibold">Inception Date</p>
                        <p className="text-muted-foreground">{etf.inceptionDate}</p>
                    </div>
                     <div>
                        <p className="font-semibold">Expense Ratio</p>
                        <p className="text-muted-foreground">{etf.expenseRatio}%</p>
                    </div>
                     <div>
                        <p className="font-semibold">Assets Under Management</p>
                        <p className="text-muted-foreground">${(etf.aum / 1_000_000_000).toFixed(2)}B</p>
                    </div>
                </div>
                 <div>
                    <h4 className="font-semibold mb-2">Underlying Assets</h4>
                    <div className="space-y-2">
                        {etf.underlyingAssets.map(asset => (
                            <div key={asset.symbol} className="flex justify-between items-center p-2 bg-muted/50 rounded-md">
                                <span>{asset.name} ({asset.symbol})</span>
                                <span className="font-medium">{asset.weight.toFixed(2)}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
      </main>
      <footer className="sticky bottom-16 sm:bottom-0 z-10 bg-background/95 backdrop-blur-sm border-t p-4">
        <div className="grid grid-cols-2 gap-4">
            <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white font-bold text-lg" onClick={() => { /* Implement sell logic */ }}>Sell</Button>
            <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white font-bold text-lg" onClick={() => { /* Implement buy logic */ }}>Buy</Button>
        </div>
      </footer>
      <BottomNav />
    </div>
  );
}
