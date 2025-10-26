
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/dashboard/header';
import { Search, BarChart2, Trash2 } from 'lucide-react';
import { useAlerts, Alert } from '@/hooks/use-alerts';
import { cn } from '@/lib/utils';
import { useMarketData } from '@/hooks/use-market-data';
import { useBaskets } from '@/hooks/use-baskets';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Link from 'next/link';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { usePortfolio } from '@/hooks/use-portfolio';
import { useToast } from '@/hooks/use-toast';
import { BottomNav } from '@/components/dashboard/bottom-nav';

const orders = [
  {
    id: '1',
    name: 'Reliance Industries Ltd. (RELIANCE)',
    type: 'NSE - CNC',
    action: 'BUY',
    price: '2405.00',
    status: 'Open',
    quantity: 10,
    created: '01/12/2023',
  },
  {
    id: '2',
    name: 'NIFTY 25JAN24 21000 PE (NIFTY25JAN24P21000)',
    type: 'NFO - NRML',
    action: 'SELL',
    price: '155.00',
    status: 'Open',
    quantity: 50,
    created: '10/12/2023',
  },
];

const OrderCard = ({ order }: { order: (typeof orders)[0] }) => (
  <Card className="bg-card">
    <CardContent className="p-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold">{order.name}</h3>
          <p className="text-sm text-muted-foreground">{order.type}</p>
        </div>
        <span
          className={`px-2 py-1 text-xs font-semibold rounded ${
            order.action === 'BUY'
              ? 'bg-green-500/20 text-green-500'
              : 'bg-red-500/20 text-red-500'
          }`}
        >
          {order.action}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-y-2 text-sm mt-4">
        <div>
          <p className="text-muted-foreground">Price</p>
          <p>₹{order.price}</p>
        </div>
        <div className="text-right">
          <p className="text-muted-foreground">Qty: {order.quantity}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Status</p>
          <p className="text-blue-400">{order.status}</p>
        </div>
        <div className="text-right">
          <p className="text-muted-foreground">Created: {order.created}</p>
        </div>
      </div>
      <div className="flex gap-2 mt-4">
        <Button variant="outline" className="w-full">
          Modify
        </Button>
        <Button variant="destructive" className="w-full bg-red-600 hover:bg-red-700">
          Cancel
        </Button>
      </div>
    </CardContent>
  </Card>
);

const AlertCard = ({ alert, currentPrice, onRemove }: { alert: Alert, currentPrice: number, onRemove: (id: string) => void }) => {
    const isAbove = currentPrice >= alert.price;
    const priceDifference = Math.abs(currentPrice - alert.price);
    const percentageDifference = (priceDifference / alert.price) * 100;

    return (
        <Card className="bg-card">
            <CardContent className="p-4">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="font-bold text-lg">{alert.cryptoSymbol}</h3>
                        <p className={cn("text-sm", isAbove ? 'text-green-500' : 'text-red-500')}>
                            Price is {isAbove ? 'above' : 'below'} alert
                        </p>
                    </div>
                     <Button variant="ghost" size="icon" onClick={() => onRemove(alert.id)}>
                        <Trash2 className="h-5 w-5 text-muted-foreground hover:text-destructive" />
                    </Button>
                </div>
                <div className="grid grid-cols-2 gap-y-2 text-sm mt-4">
                    <div>
                        <p className="text-muted-foreground">Alert Price</p>
                        <p className="font-semibold">${alert.price.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-muted-foreground">Current Price</p>
                        <p className="font-semibold">${currentPrice.toLocaleString()}</p>
                    </div>
                     <div>
                        <p className="text-muted-foreground">Difference</p>
                        <p className={cn("font-semibold", isAbove ? 'text-green-500' : 'text-red-500')}>
                           {isAbove ? '+' : '-'}{percentageDifference.toFixed(2)}%
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-muted-foreground">Status</p>
                        <p className="font-semibold capitalize">{alert.status}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default function OrdersPage() {
  const [activeTab, setActiveTab] = React.useState('Limit');
  const { alerts, removeAlert, updateAlertStatus } = useAlerts();
  const { marketData } = useMarketData();
  const { baskets, removeBasket } = useBaskets();
  const [basketToDelete, setBasketToDelete] = React.useState<string | null>(null);
  const { buy, sell } = usePortfolio(marketData);
  const { toast } = useToast();

  // Check alerts against current market data
  React.useEffect(() => {
    alerts.forEach(alert => {
        if (alert.status === 'active') {
            const asset = marketData.find(c => c.id === alert.cryptoId);
            if (asset && asset.price >= alert.price) {
                // In a real app, you'd trigger a notification here.
                console.log(`Alert triggered for ${alert.cryptoSymbol}! Price reached $${alert.price}`);
                updateAlertStatus(alert.id, 'triggered');
            }
        }
    })
  }, [marketData, alerts, updateAlertStatus]);
  
  const getAssetPath = (item: { assetType?: string, id: string }) => {
    switch (item.assetType) {
        case 'Crypto ETF': return `/trade/etf/${item.id}`;
        case 'Mutual Fund': return `/trade/mutual-fund/${item.id}`;
        case 'Web3': return `/trade/web3/${item.id}`;
        case 'Futures': return `/trade/futures/${item.id}`;
        case 'Spot': return `/trade/${item.id}`;
        default: return `/crypto/${item.id}`;
    }
  }

  const handleDeleteBasket = () => {
    if (basketToDelete) {
        removeBasket(basketToDelete);
        setBasketToDelete(null);
    }
  };

  const executeOrder = (item: any, asset: any) => {
    const margin = (item.quantity || 0) * (item.price || 0);
    buy(item.id, margin);
    toast({
        title: "Order Executed",
        description: `Your order for ${item.quantity} ${item.symbol} has been placed.`
    });
  }


  const TABS = ['Limit', 'HODL', 'Baskets', 'SP', 'Alerts'];

  return (
    <>
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <Header />
        <main className="flex-1 overflow-y-auto pb-20 p-4 space-y-4">
          <div className="border-b border-border">
            <div className="px-4 overflow-x-auto">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground whitespace-nowrap">
                {TABS.map(tab => (
                  <Button key={tab} variant="ghost" className={cn("px-3", activeTab === tab && "text-primary")} onClick={() => setActiveTab(tab)}>
                    {tab}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between px-4 py-2 border-b border-border">
              <Search className="h-5 w-5 text-muted-foreground" />
              <Button variant="link" className="text-primary">
                  <BarChart2 className="h-4 w-4 mr-2" />
                  Analytics
              </Button>
          </div>

          <div className="p-4 space-y-4">
              {activeTab === 'Limit' && orders.map(order => (
                  <OrderCard key={order.id} order={order} />
              ))}
              {activeTab === 'Alerts' && (
                  alerts.length > 0 ? alerts.map(alert => {
                    const asset = marketData.find(c => c.id === alert.cryptoId);
                    return asset ? <AlertCard key={alert.id} alert={alert} currentPrice={asset.price} onRemove={removeAlert} /> : null;
                  }) : (
                      <div className="text-center text-muted-foreground py-10">
                          <p>You have no active alerts.</p>
                          <p className="text-sm">You can set price alerts from the trade screen.</p>
                      </div>
                  )
              )}
              {activeTab === 'Baskets' && (
                  baskets.length > 0 ? (
                      <Accordion type="single" collapsible className="w-full">
                          {baskets.map(basket => (
                              <AccordionItem value={basket.name} key={basket.name}>
                                  <AccordionTrigger>
                                      <div className='flex justify-between items-center w-full pr-4'>
                                          <span>{basket.name}</span>
                                          <div className="flex items-center gap-2">
                                            <span className='text-muted-foreground text-sm'>{basket.items.length} items</span>
                                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); setBasketToDelete(basket.name); }}>
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                          </div>
                                      </div>
                                  </AccordionTrigger>
                                  <AccordionContent>
                                      <div className="divide-y">
                                          {basket.items.map(item => {
                                              const asset = marketData.find(a => a.id === item.id);
                                              const itemPrice = typeof item.price === 'number' ? item.price : 0;
                                              const itemQuantity = typeof item.quantity === 'number' ? item.quantity : 0;
                                              const margin = itemQuantity * itemPrice;
                                              return (
                                                  <div key={item.id} className="p-2">
                                                      <div className="flex justify-between items-center">
                                                          <div>
                                                              <p className="font-semibold">{item.name} <span className="text-xs text-muted-foreground">({item.assetType})</span></p>
                                                              <p className="text-xs text-muted-foreground">{item.symbol}</p>
                                                          </div>
                                                          {asset && (
                                                              <div className="text-right">
                                                                  <p className='font-semibold'>${asset.price.toLocaleString()}</p>
                                                                  <p className={cn('text-sm', asset.change24h >= 0 ? 'text-green-500' : 'text-red-500')}>
                                                                      {asset.change24h.toFixed(2)}%
                                                                  </p>
                                                              </div>
                                                          )}
                                                      </div>
                                                      <div className="grid grid-cols-3 gap-2 mt-2 text-xs text-muted-foreground">
                                                          <div>
                                                              <p>Qty</p>
                                                              <p className="font-medium text-foreground">{itemQuantity.toFixed(4)}</p>
                                                          </div>
                                                           <div>
                                                              <p>Price</p>
                                                              <p className="font-medium text-foreground">${itemPrice.toLocaleString()}</p>
                                                          </div>
                                                           <div className="text-right">
                                                              <p>Margin</p>
                                                              <p className="font-medium text-foreground">${margin.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                                                          </div>
                                                      </div>
                                                      <div className="flex gap-2 mt-4">
                                                          <Link href={getAssetPath(item)} className="w-full">
                                                              <Button variant="outline" size="sm" className="w-full">Modify</Button>
                                                          </Link>
                                                          <Button size="sm" className="w-full" onClick={() => executeOrder(item, asset)}>Execute</Button>
                                                      </div>
                                                  </div>
                                              )
                                          })}
                                      </div>
                                  </AccordionContent>
                              </AccordionItem>
                          ))}
                      </Accordion>
                  ) : (
                      <div className="text-center text-muted-foreground py-10">
                          <p>You have no baskets.</p>
                          <p className="text-sm">Create a basket from any trade screen.</p>
                      </div>
                  )
              )}
              {(activeTab !== 'Limit' && activeTab !== 'Alerts' && activeTab !== 'Baskets') && (
                  <div className="text-center text-muted-foreground py-10">
                      <p>No {activeTab.toLowerCase()} orders found.</p>
                  </div>
              )}
          </div>
        </main>
        <BottomNav />
      </div>
      <AlertDialog open={!!basketToDelete} onOpenChange={(open) => !open && setBasketToDelete(null)}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
                This action will permanently delete the basket "{basketToDelete}". You cannot undo this action.
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setBasketToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteBasket} className="bg-destructive hover:bg-destructive/90">
                Delete
            </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
