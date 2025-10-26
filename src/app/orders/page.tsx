
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/dashboard/header';
import { Search, BarChart2, Trash2, PauseCircle, PlayCircle, XCircle, RotateCcw, Clock } from 'lucide-react';
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
import { useSystematicPlans } from '@/hooks/use-systematic-plans';
import { SystematicPlan, HodlOrder, LimitOrder } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { useHodlOrders } from '@/hooks/use-hodl-orders';
import { useLimitOrders } from '@/hooks/use-limit-orders';
import { useRouter } from 'next/navigation';


const LimitOrderCard = ({ order, onCancel }: { order: LimitOrder, onCancel: (id: string) => void }) => {
    const router = useRouter();

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

    const handleModify = () => {
        router.push(getAssetPath({ id: order.instrumentId, assetType: order.assetType }) + '?modify=true');
    }

    return (
        <Card className="bg-card">
            <CardContent className="p-4">
            <div className="flex justify-between items-start">
                <div>
                <h3 className="font-bold">{order.instrumentName} ({order.instrumentSymbol})</h3>
                <p className="text-sm text-muted-foreground">{order.assetType} - {order.orderType}</p>
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
                <p>${order.price.toLocaleString()}</p>
                </div>
                <div className="text-right">
                <p className="text-muted-foreground">Qty: {order.quantity.toFixed(6)}</p>
                </div>
                <div>
                <p className="text-muted-foreground">Status</p>
                <p className="text-blue-400">{order.status}</p>
                </div>
            </div>
            <div className="flex gap-2 mt-4">
                <Button variant="outline" className="w-full" onClick={handleModify}>
                Modify
                </Button>
                <Button variant="destructive" className="w-full bg-red-600 hover:bg-red-700" onClick={() => onCancel(order.id)}>
                Cancel
                </Button>
            </div>
            </CardContent>
        </Card>
    );
};

const HodlOrderCard = ({ order, onCancelClick }: { order: HodlOrder, onCancelClick: (order: HodlOrder) => void }) => {
    
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

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-lg">{order.instrumentName} <span className="text-sm text-muted-foreground">({order.instrumentSymbol})</span></CardTitle>
                        <p className="text-xs text-muted-foreground uppercase">{order.assetType} - {order.orderType}</p>
                    </div>
                    <Badge variant="outline" className="border-blue-500 text-blue-500">HODL</Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
                 <div className="grid grid-cols-3 gap-4">
                    <div>
                        <p className="text-muted-foreground">Qty.</p>
                        <p className="font-semibold">{order.quantity.toFixed(6)}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground">Price</p>
                        <p className="font-semibold">${order.price.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-muted-foreground">Margin</p>
                        <p className="font-semibold">${order.margin.toLocaleString()}</p>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                     <div>
                        <p className="text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3"/> Lock-in Period</p>
                        <p className="font-semibold">{order.period.years > 0 && `${order.period.years}y `}{order.period.months > 0 && `${order.period.months}m`}</p>
                    </div>
                     <div className="text-right">
                        <p className="text-muted-foreground">Created At</p>
                        <p className="font-semibold">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>
                 {(order.stopLoss || order.takeProfit) && (
                    <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                        <div>
                            <p className="text-muted-foreground">Stop Loss</p>
                            <p className="font-semibold text-red-500">{order.stopLoss ? `$${order.stopLoss}` : 'Not Set'}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-muted-foreground">Take Profit</p>
                            <p className="font-semibold text-green-500">{order.takeProfit ? `$${order.takeProfit}` : 'Not Set'}</p>
                        </div>
                    </div>
                )}
                 <div className="flex gap-2 mt-4">
                    <Link href={getAssetPath({id: order.instrumentId, assetType: order.assetType})} className="w-full">
                        <Button variant="outline" className="w-full">
                            Modify
                        </Button>
                    </Link>
                    <Button variant="destructive" className="w-full" onClick={() => onCancelClick(order)}>
                        Cancel
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

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

const SystematicPlanCard = ({ plan, onStatusChange }: { plan: SystematicPlan, onStatusChange: (id: string, status: 'active' | 'paused' | 'cancelled') => void }) => {
    const isSIP = plan.planType === 'sip';
    return (
        <Card>
            <CardContent className="p-4">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="font-bold text-lg">{plan.instrumentName} <span className="text-sm text-muted-foreground">({plan.instrumentSymbol})</span></h3>
                        <p className="text-sm uppercase text-primary font-medium">{plan.planType}</p>
                    </div>
                    <Badge variant={plan.status === 'active' ? 'default' : 'secondary'} className={cn(
                        plan.status === 'active' && 'bg-green-500/20 text-green-500 border-green-500/30',
                        plan.status === 'paused' && 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30',
                        plan.status === 'cancelled' && 'bg-red-500/20 text-red-500 border-red-500/30',
                    )}>{plan.status}</Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                    <div>
                        <p className="text-muted-foreground">{isSIP ? 'Installment' : 'Withdrawal'}</p>
                        <p className="font-semibold">{plan.investmentType === 'amount' ? `$${plan.amount.toLocaleString()}` : `${plan.amount} units`}</p>
                    </div>
                     <div className="text-right">
                        <p className="text-muted-foreground">Frequency</p>
                        <p className="font-semibold capitalize">{plan.frequency}</p>
                    </div>
                    {!isSIP && plan.lumpsumAmount && (
                         <div>
                            <p className="text-muted-foreground">Lumpsum</p>
                            <p className="font-semibold">${plan.lumpsumAmount.toLocaleString()}</p>
                        </div>
                    )}
                </div>
                
                <div className="flex gap-2">
                    {plan.status === 'active' && (
                        <Button variant="outline" size="sm" className="w-full" onClick={() => onStatusChange(plan.id, 'paused')}>
                            <PauseCircle className="mr-2 h-4 w-4" /> Pause
                        </Button>
                    )}
                    {plan.status === 'paused' && (
                        <Button variant="outline" size="sm" className="w-full" onClick={() => onStatusChange(plan.id, 'active')}>
                            <PlayCircle className="mr-2 h-4 w-4" /> Resume
                        </Button>
                    )}
                    {plan.status !== 'cancelled' && (
                        <Button variant="destructive" size="sm" className="w-full" onClick={() => onStatusChange(plan.id, 'cancelled')}>
                            <XCircle className="mr-2 h-4 w-4" /> Cancel
                        </Button>
                    )}
                     {plan.status === 'cancelled' && (
                        <Button variant="outline" size="sm" className="w-full" onClick={() => onStatusChange(plan.id, 'active')}>
                            <RotateCcw className="mr-2 h-4 w-4" /> Revert
                        </Button>
                    )}
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
  const { plans, updatePlanStatus } = useSystematicPlans();
  const { orders: hodlOrders, removeOrder: removeHodlOrder } = useHodlOrders();
  const { limitOrders, removeLimitOrder } = useLimitOrders();
  const [basketToDelete, setBasketToDelete] = React.useState<string | null>(null);
  const { buy, sell } = usePortfolio(marketData);
  const { toast } = useToast();
  const [hodlToCancel, setHodlToCancel] = React.useState<HodlOrder | null>(null);

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

  const handleCancelHodl = () => {
    if (hodlToCancel) {
      // Simulate selling the asset and applying penalty
      const asset = marketData.find(c => c.id === hodlToCancel.instrumentId);
      if (asset) {
        const currentValue = hodlToCancel.quantity * asset.price;
        const profit = currentValue - hodlToCancel.margin;
        let penalty = 0;
        if (profit > 0) {
          penalty = profit * 0.20;
        }
        const amountToReturn = hodlToCancel.margin + profit - penalty;
        
        // This is a simplified simulation. A real implementation would be more complex.
        buy(hodlToCancel.instrumentId, -amountToReturn); // Effectively returning funds to USD balance
      }

      removeHodlOrder(hodlToCancel.id);
      toast({
        title: "HODL Order Cancelled",
        description: `Your HODL order for ${hodlToCancel.instrumentName} has been cancelled with a 20% profit penalty.`,
        variant: "destructive"
      });
      setHodlToCancel(null);
    }
  };

  const handleCancelLimitOrder = (id: string) => {
      removeLimitOrder(id);
      toast({
          title: "Limit Order Cancelled",
          description: "Your limit order has been successfully cancelled."
      })
  }


  const TABS = ['Limit', 'HODL', 'Baskets', 'SP', 'Alerts'];

  return (
    <>
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 space-y-4 pb-20">
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
              {activeTab === 'Limit' && (
                limitOrders.length > 0 ? limitOrders.map(order => (
                  <LimitOrderCard key={order.id} order={order} onCancel={handleCancelLimitOrder} />
                )) : (
                    <div className="text-center text-muted-foreground py-10">
                        <p>You have no active limit orders.</p>
                        <p className="text-sm">Limit orders you place will appear here.</p>
                    </div>
                )
              )}
              {activeTab === 'HODL' && (
                  hodlOrders.length > 0 ? hodlOrders.map(order => (
                    <HodlOrderCard key={order.id} order={order} onCancelClick={setHodlToCancel} />
                  )) : (
                      <div className="text-center text-muted-foreground py-10">
                          <p>You have no active HODL orders.</p>
                          <p className="text-sm">You can create HODL orders from the trade screen.</p>
                      </div>
                  )
              )}
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
               {activeTab === 'SP' && (
                  plans.length > 0 ? plans.map(plan => (
                    <SystematicPlanCard key={plan.id} plan={plan} onStatusChange={updatePlanStatus} />
                  )) : (
                      <div className="text-center text-muted-foreground py-10">
                          <p>You have no active systematic plans.</p>
                          <p className="text-sm">You can set up SIP/SWP from the trade screen.</p>
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
                                                              <p className="text-xs text-muted-foreground">{item.symbol} <span className="capitalize text-primary">· {item.investmentType}</span></p>
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
              {(activeTab !== 'Limit' && activeTab !== 'HODL' && activeTab !== 'Alerts' && activeTab !== 'Baskets' && activeTab !== 'SP') && (
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
      <AlertDialog open={!!hodlToCancel} onOpenChange={(open) => !open && setHodlToCancel(null)}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Cancel HODL Order?</AlertDialogTitle>
            <AlertDialogDescription>
                Cancelling this HODL order before the lock-in period ends will incur a
                <span className="font-bold text-destructive"> 20% penalty on any profits</span>.
                Are you sure you want to proceed?
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setHodlToCancel(null)}>Keep Order</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancelHodl} className="bg-destructive hover:bg-destructive/90">
                Yes, Cancel
            </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

    