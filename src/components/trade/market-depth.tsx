
'use client';

import * as React from 'react';
import { List, BellRing } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CryptoCurrency } from '@/lib/types';
import { useAlerts } from '@/hooks/use-alerts';
import { Input } from '../ui/input';
import { useToast } from '@/hooks/use-toast';

interface MarketDepthProps {
    crypto: CryptoCurrency;
    onPriceSelect: (price: number) => void;
}

const generateOrders = (basePrice: number) => {
    const buyOrders = [];
    const sellOrders = [];
    let buyPrice = basePrice;
    let sellPrice = basePrice;

    for (let i = 1; i <= 5; i++) {
        buyPrice *= (1 - (0.001 + Math.random() * 0.001)); // decrease by 0.1% to 0.2%
        sellPrice *= (1 + (0.001 + Math.random() * 0.001)); // increase by 0.1% to 0.2%
        
        buyOrders.push({
            total: Math.floor(Math.random() * 200) + 50,
            price: buyPrice,
        });
        
        sellOrders.push({
            total: Math.floor(Math.random() * 200) + 50,
            price: sellPrice,
        });
    }
    return { buyOrders, sellOrders };
};


export function MarketDepth({ crypto, onPriceSelect }: MarketDepthProps) {
  const { addAlert } = useAlerts();
  const { toast } = useToast();
  const [isSettingAlert, setIsSettingAlert] = React.useState(false);
  const [alertPrice, setAlertPrice] = React.useState('');

  const { buyOrders, sellOrders } = React.useMemo(() => generateOrders(crypto.price), [crypto.price]);
  const totalBuy = buyOrders.reduce((acc, order) => acc + order.total, 0);
  const totalSell = sellOrders.reduce((acc, order) => acc + order.total, 0);
  
  const formatPrice = (price: number) => {
    return price.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: crypto.price < 1 ? 6 : 2,
    });
  }

  const handleSetAlert = () => {
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
        id: `${crypto.id}-${price}-${Date.now()}`,
        cryptoId: crypto.id,
        cryptoSymbol: crypto.symbol,
        price: price,
        status: 'active',
        createdAt: new Date().toISOString(),
    });
    toast({
        title: 'Alert Set!',
        description: `You will be notified when ${crypto.symbol} reaches $${price}.`
    });
    setIsSettingAlert(false);
    setAlertPrice('');
  };


  return (
    <div>
        <div className="flex flex-col space-y-1.5 p-6">
            <div className="flex items-center gap-2">
                <List className="h-5 w-5" />
                <h3 className="text-lg font-semibold leading-none tracking-tight">Market Depth</h3>
            </div>
        </div>
        <div className="p-6 pt-0">
            <div className="grid grid-cols-2 gap-4 text-center text-sm">
                <div>
                    <h4 className="font-semibold mb-1">Buy Orders</h4>
                    <p className="text-xs text-muted-foreground mb-2">Total: {totalBuy}</p>
                    <div className="space-y-1">
                        {buyOrders.map((order, i) => (
                             <div key={i} className="grid grid-cols-2 items-center p-1 rounded-sm bg-green-500/10" onClick={() => onPriceSelect(order.price)} style={{cursor: 'pointer'}}>
                                <span>{order.total}</span>
                                <span className="text-green-500">{formatPrice(order.price)}</span>
                            </div>
                        ))}
                    </div>
                </div>
                 <div>
                    <h4 className="font-semibold mb-1">Sell Orders</h4>
                    <p className="text-xs text-muted-foreground mb-2">Total: {totalSell}</p>
                    <div className="space-y-1">
                        {sellOrders.map((order, i) => (
                             <div key={i} className="grid grid-cols-2 items-center p-1 rounded-sm bg-red-500/10" onClick={() => onPriceSelect(order.price)} style={{cursor: 'pointer'}}>
                                <span className="text-red-500">{formatPrice(order.price)}</span>
                                <span>{order.total}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6">
                <Button variant="outline">Add to Basket</Button>
                <Button variant="outline" onClick={() => setIsSettingAlert(!isSettingAlert)}>
                    <BellRing className="w-4 h-4 mr-2"/>
                    Add Alert
                </Button>
            </div>
             {isSettingAlert && (
                <div className="mt-4 space-y-2">
                    <p className="text-sm font-medium">Set a price alert for {crypto.symbol}</p>
                    <div className="flex gap-2">
                        <Input 
                            type="number" 
                            placeholder={`Current: ${formatPrice(crypto.price)}`}
                            value={alertPrice}
                            onChange={(e) => setAlertPrice(e.target.value)}
                        />
                        <Button onClick={handleSetAlert}>Set Alert</Button>
                    </div>
                </div>
            )}
        </div>
    </div>
  );
}
