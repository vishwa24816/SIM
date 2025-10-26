
'use client';

import * as React from 'react';
import { useMarketData } from '@/hooks/use-market-data';
import { usePortfolio } from '@/hooks/use-portfolio';
import { PriceChart } from '@/components/dashboard/price-chart';
import { MutualFundPageHeader } from '@/components/trade/mutual-fund-page-header';
import { MutualFundOrderForm } from '@/components/trade/mutual-fund-order-form';
import { FundDetails } from '@/components/trade/fund-details';
import { SimbotAnalysis } from '@/components/trade/simbot-analysis';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { BottomNav } from '@/components/dashboard/bottom-nav';
import { Separator } from '@/components/ui/separator';
import { MUTUAL_FUNDS_DATA } from '@/lib/data';

export default function MutualFundTradePage({ params }: { params: { id: string } }) {
  const { marketData, loading: marketLoading } = useMarketData();
  const { portfolio, buy, sell } = usePortfolio(marketData);

  const fund = React.useMemo(() => {
    return MUTUAL_FUNDS_DATA.find(f => f.id === params.id);
  }, [params.id]);

  const cryptoEquivalent = React.useMemo(() => {
    if (!fund) return undefined;
    return {
      id: fund.id,
      name: fund.name,
      symbol: fund.symbol,
      icon: fund.icon,
      price: fund.nav,
      change24h: fund.change1d,
      volume24h: fund.fundSize,
      priceHistory: fund.priceHistory,
    };
  }, [fund]);

  if (marketLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <MutualFundPageHeader fund={undefined} loading={true} />
        <main className="flex-1 overflow-y-auto p-4 space-y-4 pb-20">
          <Skeleton className="h-[300px] w-full" />
          <Skeleton className="h-[400px] w-full" />
          <Skeleton className="h-[200px] w-full" />
        </main>
        <BottomNav />
      </div>
    );
  }

  if (!fund || !cryptoEquivalent) {
    return (
      <div className="flex flex-col min-h-screen bg-background text-foreground">
         <MutualFundPageHeader fund={undefined} />
        <main className="flex-1 flex items-center justify-center pb-20">
          <p>Mutual fund not found.</p>
        </main>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <MutualFundPageHeader fund={fund} />
      <main className="flex-1 overflow-y-auto p-4 space-y-6 pb-20">
        <PriceChart crypto={cryptoEquivalent} loading={marketLoading} />
        <Separator className="bg-border/50" />
        <MutualFundOrderForm fund={fund} />
        <Separator className="bg-border/50" />
        <FundDetails fund={fund} />
      </main>
      <BottomNav />
    </div>
  );
}
