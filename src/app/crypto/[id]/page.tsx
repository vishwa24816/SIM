
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
import { cn } from '@/lib/utils';
import { NewsFeed } from '@/components/dashboard/news-feed';
import { CryptoAnalysis } from '@/components/trade/crypto-analysis';
import { CryptoTechnicals } from '@/components/trade/crypto-technicals';
import { CryptoStudy } from '@/components/trade/crypto-study';

export default function CryptoDetailPage({ params }: { params: { id: string } }) {
  const { marketData, loading: marketLoading } = useMarketData();
  const [activeTab, setActiveTab] = React.useState('Market');
  
  const crypto = React.useMemo(() => {
    return marketData.find(c => c.id === params.id);
  }, [marketData, params.id]);

  const TABS = ['Market', 'News', 'Analysis', 'Technicals', 'Study'];

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
          <p>Cryptocurrency not found.</p>
        </main>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <OrderPageHeader crypto={crypto} />
      
      <div className="border-b border-border">
          <div className="overflow-x-auto px-4">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground whitespace-nowrap">
                  {TABS.map((tab) => (
                      <Button
                          key={tab}
                          variant="ghost"
                          size="sm"
                          onClick={() => setActiveTab(tab)}
                          className={cn("px-3", activeTab === tab ? 'text-primary bg-muted rounded-full' : '')}
                      >
                          {tab}
                      </Button>
                  ))}
              </div>
          </div>
      </div>

      <main className="flex-1 overflow-y-auto p-4 space-y-6 pb-20">
        {activeTab === 'Market' && (
          <>
            <PriceChart crypto={crypto} loading={marketLoading} />
            <Separator className="bg-border/50" />
            <SimbotAnalysis crypto={crypto} />
          </>
        )}
        {activeTab === 'News' && (
          <NewsFeed />
        )}
        {activeTab === 'Analysis' && (
          <CryptoAnalysis crypto={crypto} />
        )}
        {activeTab === 'Technicals' && (
          <CryptoTechnicals crypto={crypto} />
        )}
         {activeTab === 'Study' && (
          <CryptoStudy crypto={crypto} />
        )}
        {activeTab !== 'Market' && activeTab !== 'News' && activeTab !== 'Analysis' && activeTab !== 'Technicals' && activeTab !== 'Study' && (
           <div className="flex items-center justify-center h-48 text-muted-foreground">
              <p>Content for {activeTab} will be available soon.</p>
            </div>
        )}
      </main>
      <footer className="sticky bottom-0 z-10 bg-background/95 backdrop-blur-sm border-t p-4">
        <Link href={`/trade/${crypto.id}`} passHref>
          <Button size="lg" className="w-full font-bold text-lg">Trade</Button>
        </Link>
      </footer>
    </div>
  );
}
