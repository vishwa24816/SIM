

'use client';

import * as React from 'react';
import { useMarketData } from '@/hooks/use-market-data';
import { PriceChart } from '@/components/dashboard/price-chart';
import { OrderPageHeader } from '@/components/trade/order-page-header';
import { OrderForm, type SPConfig, type HodlConfig, type GeneralOrderConfig } from '@/components/trade/order-form';
import { MarketDepth } from '@/components/trade/market-depth';
import { SimbotAnalysis } from '@/components/trade/simbot-analysis';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useSystematicPlans } from '@/hooks/use-systematic-plans';
import { SystematicPlan } from '@/lib/types';
import { useHodlOrders } from '@/hooks/use-hodl-orders';
import { Button } from '@/components/ui/button';
import { useLimitOrders } from '@/hooks/use-limit-orders';
import { useParams, useSearchParams } from 'next/navigation';
import { usePortfolioStore } from '@/hooks/use-portfolio';

export default function TradePage() {
  const params = useParams();
  const id = params.id as string;
  const { marketData, loading: marketLoading, exchange, setExchange } = useMarketData();
  const { buy, sell, portfolio } = usePortfolioStore();
  const { addPlan } = useSystematicPlans();
  const { addOrder: addHodlOrder } = useHodlOrders();
  const { addLimitOrder } = useLimitOrders();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  
  const [price, setPrice] = React.useState('');
  const [orderType, setOrderType] = React.useState('market');
  const [canAddToBasket, setCanAddToBasket] = React.useState(false);
  const [quantity, setQuantity] = React.useState('');
  const [investmentType, setInvestmentType] = React.useState('delivery');
  const [spConfig, setSpConfig] = React.useState<SPConfig | null>(null);
  const [hodlConfig, setHodlConfig] = React.useState<HodlConfig | null>(null);
  const [generalOrderConfig, setGeneralOrderConfig] = React.useState<GeneralOrderConfig | null>(null);
  const [isModify, setIsModify] = React.useState(false);

  const crypto = React.useMemo(() => {
    return marketData.find(c => c.id === id);
  }, [marketData, id]);
  
  const currentHolding = React.useMemo(() => {
    if (!crypto) return undefined;
    return portfolio.holdings.find(h => h.cryptoId === crypto.id);
  }, [portfolio.holdings, crypto]);

  React.useEffect(() => {
      const modify = searchParams.get('modify');
      if (modify === 'true') {
          setIsModify(true);
      }
  }, [searchParams]);

  const handlePriceSelect = (selectedPrice: number) => {
    setPrice(selectedPrice.toFixed(crypto?.price && crypto.price < 1 ? 6 : 2));
    setOrderType('limit');
  };
  
  const handleConfirm = () => {
    if (investmentType === 'sp') {
      handleCreateSP();
    } else if (investmentType === 'hodl') {
      handleCreateHodl();
    }
    else {
      handleBuy();
    }
  }

  const handleBuy = () => {
    const qty = parseFloat(quantity);
    if (!crypto || !qty || qty <= 0) {
        toast({ variant: 'destructive', title: 'Invalid quantity', description: 'Please enter a valid quantity.' });
        return;
    }
    
    const executionPrice = orderType === 'market' ? crypto.price : parseFloat(price);
    if (!executionPrice || (orderType === 'limit' && executionPrice <= 0)) {
       toast({ variant: 'destructive', title: 'Invalid price', description: 'Please enter a valid limit price.' });
       return;
    }

    let sl: number | undefined;
    let tp: number | undefined;
    let tsl: { percentage: number } | undefined;

    if (generalOrderConfig?.stopLoss) {
        const slValue = parseFloat(generalOrderConfig.stopLoss);
        if (generalOrderConfig.stopLossType === 'percentage') {
            sl = executionPrice * (1 - slValue / 100);
        } else {
            sl = slValue;
        }
    }
     if (generalOrderConfig?.takeProfit) {
        const tpValue = parseFloat(generalOrderConfig.takeProfit);
        if (generalOrderConfig.takeProfitType === 'percentage') {
            tp = executionPrice * (1 + tpValue / 100);
        } else {
            tp = tpValue;
        }
    }
    if (generalOrderConfig?.trailingStopLoss) {
      const tslValue = parseFloat(generalOrderConfig.trailingStopLoss);
      if (tslValue > 0) {
        tsl = { percentage: tslValue };
      }
    }


    if (orderType === 'limit') {
        addLimitOrder({
            id: `${crypto.id}-limit-${Date.now()}`,
            instrumentId: crypto.id,
            instrumentName: crypto.name,
            instrumentSymbol: crypto.symbol,
            assetType: crypto.assetType,
            action: 'BUY',
            orderType: 'limit',
            price: executionPrice,
            quantity: qty,
            status: 'Open',
            stopLoss: sl,
            takeProfit: tp,
            trailingStopLoss: tsl,
        });
        toast({ title: 'Limit Order Placed', description: `Your limit order to buy ${crypto.name} has been placed.`});
    } else { // market order
        const margin = qty * crypto.price;
        buy(crypto, margin, qty, { stopLoss: sl, takeProfit: tp, trailingStopLoss: tsl });
    }
  };
  
  const handleSell = () => {
      const qty = parseFloat(quantity);
      if (!crypto || !qty || qty <= 0) {
          toast({ variant: 'destructive', title: 'Invalid quantity', description: 'Please enter a valid quantity.' });
          return;
      }
      sell(crypto, qty);
  }
  
  const handleCreateHodl = () => {
    if (!hodlConfig || !crypto) return;
    const { months, years } = hodlConfig;
    const qty = parseFloat(quantity);
    const prc = parseFloat(price) || crypto.price;
    const margin = qty * prc;

    if (!qty || qty <= 0) {
        toast({ variant: 'destructive', title: 'Invalid quantity', description: 'Please enter a valid quantity for your HODL order.' });
        return;
    }
    
    let sl: number | undefined;
    let tp: number | undefined;

    if (generalOrderConfig?.stopLoss) {
        const slValue = parseFloat(generalOrderConfig.stopLoss);
        if (generalOrderConfig.stopLossType === 'percentage') {
            sl = prc * (1 - slValue / 100);
        } else {
            sl = slValue;
        }
    }
    if (generalOrderConfig?.takeProfit) {
        const tpValue = parseFloat(generalOrderConfig.takeProfit);
        if (generalOrderConfig.takeProfitType === 'percentage') {
            tp = prc * (1 + tpValue / 100);
        } else {
            tp = tpValue;
        }
    }


    // Execute the buy order first
    buy(crypto, margin, qty, { stopLoss: sl, takeProfit: tp });

    // Then create the HODL order record
    addHodlOrder({
      id: `${crypto.id}-hodl-${Date.now()}`,
      instrumentId: crypto.id,
      instrumentName: crypto.name,
      instrumentSymbol: crypto.symbol,
      assetType: crypto.assetType,
      quantity: qty,
      price: prc,
      orderType: orderType as 'limit' | 'market',
      period: { months: parseInt(months) || 0, years: parseInt(years) || 0 },
      margin,
      stopLoss: sl,
      takeProfit: tp,
      createdAt: new Date().toISOString(),
    });

    toast({ title: 'HODL Order Placed', description: `Your HODL order for ${crypto.name} has been set.`});
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

  const isComplexOrder = investmentType === 'sp' || investmentType === 'hodl';

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
          onHodlConfigChange={setHodlConfig}
          onGeneralOrderConfigChange={setGeneralOrderConfig}
          exchange={exchange}
          setExchange={setExchange}
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
         {isComplexOrder ? (
             <Button size="lg" className="w-full font-bold text-lg" onClick={handleConfirm}>
                {investmentType === 'sp' ? 'Create Plan' : 
                investmentType === 'hodl' ? 'Place HODL Order' : 'Confirm'}
             </Button>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white font-bold text-lg" onClick={handleSell} disabled={!currentHolding || currentHolding.amount <= 0}>Sell</Button>
            <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white font-bold text-lg" onClick={handleBuy}>Buy</Button>
          </div>
        )}
      </footer>
    </div>
  );
}
