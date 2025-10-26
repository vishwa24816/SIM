
'use client';

import * as React from 'react';
import { useMarketData } from '@/hooks/use-market-data';
import { usePortfolio } from '@/hooks/use-portfolio';
import { PriceChart } from '@/components/dashboard/price-chart';
import { OrderPageHeader } from '@/components/trade/order-page-header';
import { OrderForm, type SPConfig } from '@/components/trade/order-form';
import { MarketDepth } from '@/components/trade/market-depth';
import { SimbotAnalysis } from '@/components/trade/simbot-analysis';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { SwipeToConfirm } from '@/components/ui/swipe-to-confirm';
import { useToast } from '@/hooks/use-toast';
import { useSystematicPlans } from '@/hooks/use-systematic-plans';
import { SystematicPlan } from '@/lib/types';

export default function TradePage({ params }: { params: { id: string } }) {
  const { marketData, loading: marketLoading } = useMarketData();
  const { portfolio, buy, sell } = usePortfolio(marketData);
  const { addPlan } = useSystematicPlans();
  const { toast } = useToast();
  
  const [price, setPrice] = React.useState('');
  const [orderType, setOrderType] = React.useState('limit');
  const [canAddToBasket, setCanAddToBasket] = React.useState(false);
  const [quantity, setQuantity] = React.useState('');
  const [investmentType, setInvestmentType] = React.useState('delivery');
  const [spConfig, setSpConfig] = React.useState<SPConfig | null>(null);

  const crypto = React.useMemo(() => {
    return marketData.find(c => c.id === params.id);
  }, [marketData, params.id]);

  const handlePriceSelect = (selectedPrice: number) => {
    setPrice(selectedPrice.toFixed(crypto?.price && crypto.price < 1 ? 6 : 2));
    setOrderType('limit');
  };
  
  const handleConfirm = () => {
    if (investmentType === 'sp') {
      handleCreateSP();
    } else {
      handleBuy();
    }
  }

  const handleBuy = () => {
    const qty = parseFloat(quantity);
    if (!crypto || !qty || qty <= 0) {
        toast({ variant: 'destructive', title: 'Invalid quantity', description: 'Please enter a valid quantity.' });
        return;
    }
    const margin = qty * (parseFloat(price) || crypto.price);
    buy(crypto.id, margin);
  };
  
  const handleSell = () => {
      const qty = parseFloat(quantity);
      if (!crypto || !qty || qty <= 0) {
          toast({ variant: 'destructive', title: 'Invalid quantity', description: 'Please enter a valid quantity.' });
          return;
      }
      sell(crypto.id, qty);
  }

  const handleCreateSP = () => {
    if (!spConfig || !crypto) return;

    const { spPlanType, spAmount, swpLumpsum, sipInvestmentType, swpWithdrawalType, spFrequency } = spConfig;
    
    const numericAmount = parseFloat(spAmount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      toast({ variant: 'destructive', title: 'Invalid Amount', description: `Please enter a valid ${spPlanType === 'sip' ? 'investment' : 'withdrawal'} amount.`});
      return;
    }

    let plan: Omit<SystematicPlan, 'id' | 'createdAt' | 'status'> = {
        instrumentId: crypto.id,
        instrumentName: crypto.name,
        instrumentSymbol: crypto.symbol,
        planType: spPlanType,
        amount: numericAmount,
        frequency: spFrequency,
        investmentType: 'amount'
    };

    if (spPlanType === 'sip') {
        plan.investmentType = sipInvestmentType;
    } else { // swp
        const numericLumpsum = parseFloat(swpLumpsum);
        if (isNaN(numericLumpsum) || numericLumpsum <= 0) {
            toast({ variant: 'destructive', title: 'Invalid Lumpsum', description: 'Please enter a valid lumpsum amount for SWP.'});
            return;
        }
        plan.lumpsumAmount = numericLumpsum;
        plan.investmentType = swpWithdrawalType;
    }
    
    addPlan({
        ...plan,
        id: `${crypto.id}-${spPlanType}-${Date.now()}`,
        createdAt: new Date().toISOString(),
        status: 'active'
    } as SystematicPlan);

    toast({ title: 'Systematic Plan Created', description: `Your ${spPlanType.toUpperCase()} for ${crypto.name} has been set up.`});
  }

  React.useEffect(() => {
    if (crypto) {
        setPrice(crypto.price.toFixed(crypto.price < 1 ? 6 : 2));
    }
    if (orderType === 'market' && crypto) {
        setPrice(crypto.price.toFixed(crypto.price < 1 ? 6 : 2));
    }
  }, [crypto, orderType]);

  if (marketLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <OrderPageHeader crypto={undefined} loading={true} />
        <main className="flex-1 overflow-y-auto p-4 space-y-4">
          <Skeleton className="h-[300px] w-full" />
          <Skeleton className="h-[400px] w-full" />
          <Skeleton className="h-[200px] w-full" />
        </main>
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
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <OrderPageHeader crypto={crypto} />
      <main className="flex-1 overflow-y-auto p-4 space-y-6">
        <PriceChart crypto={crypto} loading={marketLoading} />
        <Separator className="bg-border/50" />
        <OrderForm
          crypto={crypto}
          price={price}
          setPrice={setPrice}
          orderType={orderType}
          setOrderType={setOrderType}
          onCanAddToBasketChange={setCanAddToBasket}
          quantity={quantity}
          setQuantity={setQuantity}
          investmentType={investmentType}
          setInvestmentType={setInvestmentType}
          onSPConfigChange={setSpConfig}
        />
        <Separator className="bg-border/50" />
        <MarketDepth 
          crypto={crypto} 
          onPriceSelect={handlePriceSelect} 
          canAddToBasket={canAddToBasket}
          orderState={{price, quantity, orderType, investmentType}}
        />
        <Separator className="bg-border/50" />
        <SimbotAnalysis crypto={crypto} showTabs={true} />
      </main>
      <footer className="sticky bottom-0 z-10 bg-background/95 backdrop-blur-sm border-t p-4 space-y-3">
        <SwipeToConfirm 
          onConfirm={handleConfirm}
          text={investmentType === 'sp' ? 'Swipe to Create Plan' : 'Swipe to Buy'}
        />
      </footer>
    </div>
  );
}
