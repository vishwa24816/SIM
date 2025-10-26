
'use client';

import * as React from 'react';
import { useMarketData } from '@/hooks/use-market-data';
import { usePortfolio } from '@/hooks/use-portfolio';
import { PriceChart } from '@/components/dashboard/price-chart';
import { OrderPageHeader } from '@/components/trade/order-page-header';
import { FuturesOrderForm } from '@/components/trade/futures-order-form';
import { MarketDepth } from '@/components/trade/market-depth';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { CryptoTechnicals } from '@/components/trade/crypto-technicals';
import { CryptoAnalysis } from '@/components/trade/crypto-analysis';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export default function FuturesTradePage({ params }: { params: { id: string } }) {
  const { marketData, loading: marketLoading } = useMarketData();
  const { buy, sell } = usePortfolio(marketData);
  const { toast } = useToast();
  
  const [price, setPrice] = React.useState('');
  const [orderType, setOrderType] = React.useState('limit');
  const [activeTab, setActiveTab] = React.useState('Technicals');
  const [investmentType, setInvestmentType] = React.useState('delivery');
  const [quantity, setQuantity] = React.useState('');
  const [canAddToBasket, setCanAddToBasket] = React.useState(false);
  const [leverage, setLeverage] = React.useState('5');
  
  const TABS = ['Technicals', 'Analysis'];
  
  const futuresData = React.useMemo(() => marketData
    .filter(crypto => crypto.assetType === 'Spot' && crypto.id !== 'tether' && crypto.id !== 'usd-coin')
    .map(crypto => ({
      ...crypto,
      price: crypto.price,
      symbol: `${crypto.symbol}-FUT`,
      name: `${crypto.name} Futures`,
      id: `${crypto.id}-fut`,
      assetType: 'Futures' as const,
  })), [marketData]);

  const crypto = React.useMemo(() => {
    return futuresData.find(c => c.id === params.id);
  }, [futuresData, params.id]);

  const handlePriceSelect = (selectedPrice: number) => {
    setPrice(selectedPrice.toFixed(crypto?.price && crypto.price < 1 ? 6 : 2));
    setOrderType('limit');
  };

  const handleTrade = (action: 'buy' | 'sell') => {
    const qty = parseFloat(quantity);
    if (!crypto || !qty || qty <= 0) {
      toast({ variant: 'destructive', title: 'Invalid Quantity', description: 'Please enter a valid quantity.' });
      return;
    }
    const prc = parseFloat(price) || crypto.price;
    const margin = (qty * prc) / parseInt(leverage, 10);
    
    if (action === 'buy') {
      buy(crypto.id, margin, qty);
    } else {
      sell(crypto.id, qty);
    }
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
