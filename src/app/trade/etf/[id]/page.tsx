
'use client';

import * as React from 'react';
import { useMarketData } from '@/hooks/use-market-data';
import { PriceChart } from '@/components/dashboard/price-chart';
import { OrderPageHeader } from '@/components/trade/order-page-header';
import { OrderForm } from '@/components/trade/order-form';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { CRYPTO_ETFS_DATA } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAlerts } from '@/hooks/use-alerts';
import { useToast } from '@/hooks/use-toast';
import { BellRing, Briefcase } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { AddToBasketForm } from '@/components/trade/add-to-basket-form';
import { CryptoCurrency } from '@/lib/types';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

export default function ETFTradePage({ params }: { params: { id: string } }) {
  const { marketData, loading: marketLoading } = useMarketData();
  const { addAlert } = useAlerts();
  const { toast } = useToast();
  
  const [price, setPrice] = React.useState('');
  const [orderType, setOrderType] = React.useState('limit');
  const [isSettingAlert, setIsSettingAlert] = React.useState(false);
  const [alertPrice, setAlertPrice] = React.useState('');
  const [isAddingToBasket, setIsAddingToBasket] = React.useState(false);
  const [canAddToBasket, setCanAddToBasket] = React.useState(false);
  const [quantity, setQuantity] = React.useState('');
  const [investmentType, setInvestmentType] = React.useState('delivery');


  const etf = React.useMemo(() => {
    return marketData.find(e => e.id === params.id && e.assetType === 'Crypto ETF') as CryptoCurrency | undefined;
  }, [params.id, marketData]);

  const staticEtfData = React.useMemo(() => {
     return CRYPTO_ETFS_DATA.find(e => e.id === params.id)
  }, [params.id]);


  React.useEffect(() => {
    if (etf) {
        setPrice(etf.price.toFixed(2));
    }
    if (orderType === 'market' && etf) {
        setPrice(etf.price.toFixed(2));
    }
  }, [etf, orderType]);
  
  const formatPrice = (price: number) => {
    if (!etf) return '';
    return price.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  const handleSetAlert = () => {
    if (!etf) return;
    const price = parseFloat(alertPrice);
    if (isNaN(price) || price <= 0) {
        toast({
            variant: 'destructive',
            title: 'Invalid Price',
            description: 'Please enter a valid price for the alert.'
        });
        return;
    }
    addAlert({
        id: `${etf.id}-${price}-${Date.now()}`,
        cryptoId: etf.id,
        cryptoSymbol: etf.symbol,
        price: price,
        status: 'active',
        createdAt: new Date().toISOString(),
    });
    toast({
        title: 'Alert Set!',
        description: `You will be notified when ${etf.symbol} reaches $${price}.`
    });
    setIsSettingAlert(false);
    setAlertPrice('');
  };


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

  if (!etf || !staticEtfData) {
    return (
      <div className="flex flex-col min-h-screen bg-background text-foreground">
         <OrderPageHeader crypto={undefined} />
        <main className="flex-1 flex items-center justify-center">
          <p>ETF not found.</p>
        </main>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <OrderPageHeader crypto={etf} />
        <main className="flex-1 overflow-y-auto p-4 space-y-6 pb-24">
          <PriceChart crypto={etf} loading={marketLoading} />
          <Separator className="bg-border/50" />
          <OrderForm
            crypto={etf}
            price={price}
            setPrice={setPrice}
            orderType={orderType}
            setOrderType={setOrderType}
            onCanAddToBasketChange={setCanAddToBasket}
            quantity={quantity}
            setQuantity={setQuantity}
            investmentType={investmentType}
            setInvestmentType={setInvestmentType}
          />
          <Separator className="bg-border/50" />
          
          <Collapsible open={isAddingToBasket} onOpenChange={setIsAddingToBasket}>
            <div className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <CollapsibleTrigger asChild>
                        <Button variant="outline" disabled={!canAddToBasket}>
                            <Briefcase className="w-4 h-4 mr-2" />
                            Add to Basket
                        </Button>
                    </CollapsibleTrigger>
                    <Button variant="outline" onClick={() => setIsSettingAlert(!isSettingAlert)}>
                        <BellRing className="w-4 h-4 mr-2"/>
                        Add Alert
                    </Button>
                </div>
                {isSettingAlert && (
                    <div className="mt-4 space-y-2">
                        <p className="text-sm font-medium">Set a price alert for {etf.symbol}</p>
                        <div className="flex gap-2">
                            <Input 
                                type="number" 
                                placeholder={`Current: ${formatPrice(etf.price)}`}
                                value={alertPrice}
                                onChange={(e) => setAlertPrice(e.target.value)}
                            />
                            <Button onClick={handleSetAlert}>Set Alert</Button>
                        </div>
                    </div>
                )}
            </div>
            <CollapsibleContent>
                 <AddToBasketForm
                    instrument={{ id: etf.id, name: etf.name, symbol: etf.symbol, assetType: 'Crypto ETF' }}
                    orderState={{price, quantity, orderType, investmentType}}
                    onClose={() => setIsAddingToBasket(false)}
                />
            </CollapsibleContent>
          </Collapsible>


          <Card>
              <CardHeader>
                  <CardTitle>About {etf.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                  <p className="text-muted-foreground">{staticEtfData.description}</p>
                  <div className="grid grid-cols-2 gap-4">
                      <div>
                          <p className="font-semibold">Issuer</p>
                          <p className="text-muted-foreground">{staticEtfData.issuer}</p>
                      </div>
                      <div>
                          <p className="font-semibold">Inception Date</p>
                          <p className="text-muted-foreground">{staticEtfData.inceptionDate}</p>
                      </div>
                      <div>
                          <p className="font-semibold">Expense Ratio</p>
                          <p className="text-muted-foreground">{staticEtfData.expenseRatio}%</p>
                      </div>
                      <div>
                          <p className="font-semibold">Assets Under Management</p>
                          <p className="text-muted-foreground">${(staticEtfData.aum / 1_000_000_000).toFixed(2)}B</p>
                      </div>
                  </div>
                  <div>
                      <h4 className="font-semibold mb-2">Underlying Assets</h4>
                      <div className="space-y-2">
                          {staticEtfData.underlyingAssets.map(asset => (
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
        <footer className="sticky bottom-0 z-10 bg-background/95 backdrop-blur-sm border-t p-4">
          <div className="grid grid-cols-2 gap-4">
              <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white font-bold text-lg" onClick={() => { /* Implement sell logic */ }}>Sell</Button>
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white font-bold text-lg" onClick={() => { /* Implement buy logic */ }}>Buy</Button>
          </div>
        </footer>
      </div>
    </>
  );
}
