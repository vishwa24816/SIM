
'use client';

import * as React from 'react';
import { useMarketData } from '@/hooks/use-market-data';
import { PriceChart } from '@/components/dashboard/price-chart';
import { OrderPageHeader } from '@/components/trade/order-page-header';
import { SimbotAnalysis } from '@/components/trade/simbot-analysis';
import { Skeleton } from '@/components/ui/skeleton';
import { BottomNav } from '@/components/dashboard/bottom-nav';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function CryptoDetailPage({ params }: { params: { id: string } }) {
  const { marketData, loading: marketLoading } = useMarketData();
  
  const crypto = React.useMemo(() => {
    return marketData.find(c => c.id === params.id);
  }, [marketData, params.id]);


  if (marketLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <OrderPageHeader crypto={undefined} loading={true} />
        <main className="flex-1 overflow-y-auto p-4 space-y-4">
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
        <main className="flex-1 flex items-center justify-center">
          <p>Cryptocurrency not found.</p>
        </main>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <OrderPageHeader crypto={crypto} />
      <main className="flex-1 overflow-y-auto p-4 space-y-6">
        <PriceChart crypto={crypto} loading={marketLoading} />
        <Separator className="bg-border/50" />
        <SimbotAnalysis crypto={crypto} />
      </main>
      <footer className="sticky bottom-16 sm:bottom-0 z-10 bg-background/95 backdrop-blur-sm border-t p-4">
        <Link href={`/trade/${crypto.id}`} passHref>
          <Button size="lg" className="w-full font-bold text-lg">Trade</Button>
        </Link>
      </footer>
      <BottomNav />
    </div>
  );
}
