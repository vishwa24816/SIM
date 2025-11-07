

'use client';

import * as React from 'react';
import { useMarketData } from '@/hooks/use-market-data';
import { PriceChart } from '@/components/dashboard/price-chart';
import { FuturesOrderForm } from '@/components/trade/futures-order-form';
import { MarketDepth } from '@/components/trade/market-depth';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { CryptoTechnicals } from '@/components/trade/crypto-technicals';
import { CryptoAnalysis } from '@/components/trade/crypto-analysis';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useParams } from 'next/navigation';
import { usePortfolioStore } from '@/hooks/use-portfolio';
import { GeneralOrderConfig } from '@/components/trade/order-form';
import { OrderPageHeader } from '@/components/trade/order-page-header';
import { useUser, useFirestore } from '@/firebase';

export default function FuturesTradePage() {
  const params = useParams();
  const id = params.id as string;
  const { marketData, loading: marketLoading } = useMarketData();
  const { buy } = usePortfolioStore();
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();
  
  const [price, setPrice] = React.useState('');
  const [orderType, setOrderType] = React.useState('market');
  const [activeTab, setActiveTab] = React.useState('Technicals');
  const [investmentType, setInvestmentType] = React.useState('delivery');
  const [quantity, setQuantity] = React.useState('');
  const [canAddToBasket, setCanAddToBasket] = React.useState(false);
  const [leverage, setLeverage] = React.useState('5');
  const [generalOrderConfig, setGeneralOrderConfig] = React.useState<GeneralOrderConfig | null>(null);
  
  const TABS = ['Technicals', 'Analysis'];
  
  const crypto = React.useMemo(() => {
    return marketData.find(c => c.id === id);
  }, [marketData, id]);


  const handlePriceSelect = (selectedPrice: number) => {
    setPrice(selectedPrice.toFixed(crypto?.price && crypto.price < 1 ? 6 : 2));
    setOrderType('limit');
  };

  const handleTrade = (action: 'buy' | 'sell') => {
    if (!user || !firestore) return;
    const qty = parseFloat(quantity);
    if (!crypto || !qty || qty <= 0) {
      toast({ variant: 'destructive', title: 'Invalid Quantity', description: 'Please enter a valid quantity.' });
      return;
    }
    const executionPrice = parseFloat(price) || crypto.price;
    const margin = (qty * executionPrice) / parseInt(leverage, 10);
    const tradeQuantity = action === 'buy' ? qty : -qty; // Use negative quantity for shorts
    
    let sl: number | undefined;
    let tp: number | undefined;
    let tsl: { percentage: number } | undefined;

    if (generalOrderConfig?.stopLoss) {
        const slValue = parseFloat(generalOrderConfig.stopLoss);
        if (generalOrderConfig.stopLossType === 'percentage') {
            const priceChange = executionPrice * (slValue / 100);
            sl = action === 'buy' ? executionPrice - priceChange : executionPrice + priceChange;
        } else {
            sl = slValue;
        }
    }
     if (generalOrderConfig?.takeProfit) {
        const tpValue = parseFloat(generalOrderConfig.takeProfit);
        if (generalOrderConfig.takeProfitType === 'percentage') {
            const priceChange = executionPrice * (tpValue / 100);
            tp = action === 'buy' ? executionPrice + priceChange : executionPrice - priceChange;
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

    buy(user, firestore, crypto, margin, tradeQuantity, { stopLoss: sl, takeProfit: tp, trailingStopLoss: tsl });
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
          <p>Futures contract not found.</p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <OrderPageHeader crypto={crypto} />
      
      <main className="flex-1 overflow-y-auto p-4 space-y-6 pb-24">
        <PriceChart crypto={crypto} loading={marketLoading} />
        <Separator className="bg-border/50" />
        <FuturesOrderForm
          crypto={crypto}
          price={price}
          setPrice={setPrice}
          orderType={orderType}
          setOrderType={setOrderType}
          investmentType={investmentType}
          setInvestmentType={setInvestmentType}
          quantity={quantity}
          setQuantity={setQuantity}
          leverage={leverage}
          setLeverage={setLeverage}
          onGeneralOrderConfigChange={setGeneralOrderConfig}
        />
        <Separator className="bg-border/50" />
        <MarketDepth 
          crypto={crypto} 
          onPriceSelect={handlePriceSelect}
          canAddToBasket={canAddToBasket}
          orderState={{price, quantity, orderType, investmentType}}
        />
        <Separator className="bg-border/50" />
        
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

        {activeTab === 'Technicals' && <CryptoTechnicals crypto={crypto} />}
        {activeTab === 'Analysis' && <CryptoAnalysis crypto={crypto} />}
        
      </main>
      <footer className="sticky bottom-0 z-10 bg-background/95 backdrop-blur-sm border-t p-4">
        <div className="grid grid-cols-2 gap-4">
            <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white font-bold text-lg" onClick={() => handleTrade('sell')}>Sell / Short</Button>
            <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white font-bold text-lg" onClick={() => handleTrade('buy')}>Buy / Long</Button>
        </div>
      </footer>
    </div>
  );
}
