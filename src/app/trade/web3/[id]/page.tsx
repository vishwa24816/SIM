
'use client';

import * as React from 'react';
import { useMarketData } from '@/hooks/use-market-data';
import { PriceChart } from '@/components/dashboard/price-chart';
import { OrderPageHeader } from '@/components/trade/order-page-header';
import { Web3OrderForm } from '@/components/trade/web3-order-form';
import { Skeleton } from '@/components/ui/skeleton';
import { BottomNav } from '@/components/dashboard/bottom-nav';
import { Separator } from '@/components/ui/separator';
import { useParams } from 'next/navigation';

export default function Web3TradePage() {
  const params = useParams();
  const id = params.id as string;
  const { marketData, loading: marketLoading } = useMarketData();

  const crypto = React.useMemo(() => {
    return marketData.find(c => c.id === id);
  }, [marketData, id]);

  if (marketLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <OrderPageHeader crypto={undefined} loading={true} />
        <main className="flex-1 overflow-y-auto p-4 space-y-4 pb-20">
          <Skeleton className="h-[300px] w-full" />
          <Skeleton className="h-[400px] w-full" />
        </main>
        <BottomNav />
      </div>
    );
  }

  if (!crypto) {
    return (
      <div className="flex flex-col min-h-screen bg-background text-foreground">
         <OrderPageHeader crypto={undefined} />
        <main className="flex-1 flex items-center justify-center pb-20">
          <p>Web3 instrument not found.</p>
        </main>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <OrderPageHeader crypto={crypto} />
      <main className="flex-1 overflow-y-auto p-4 space-y-6 pb-20">
        <PriceChart crypto={crypto} loading={marketLoading} />
        <Separator className="bg-border/50" />
        <Web3OrderForm crypto={crypto} />
      </main>
      <BottomNav />
    </div>
  );
}
