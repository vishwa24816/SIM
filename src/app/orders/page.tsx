
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Header } from '@/components/dashboard/header';
import { Search, BarChart2, Trash2 } from 'lucide-react';
import { BottomNav } from '@/components/dashboard/bottom-nav';
import { useAlerts, Alert } from '@/hooks/use-alerts';
import { cn } from '@/lib/utils';
import { useMarketData } from '@/hooks/use-market-data';

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

  // Check alerts against current market data
  React.useEffect(() => {
    alerts.forEach(alert => {
        if (alert.status === 'active') {
            const crypto = marketData.find(c => c.id === alert.cryptoId);
            if (crypto && crypto.price >= alert.price) {
                // In a real app, you'd trigger a notification here.
                console.log(`Alert triggered for ${alert.cryptoSymbol}! Price reached $${alert.price}`);
                updateAlertStatus(alert.id, 'triggered');
            }
        }
    })
  }, [marketData, alerts, updateAlertStatus]);

  const TABS = ['Limit', 'HODL', 'Baskets', 'SP', 'Alerts'];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-1 overflow-y-auto">
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
                   const crypto = marketData.find(c => c.id === alert.cryptoId);
                   return crypto ? <AlertCard key={alert.id} alert={alert} currentPrice={crypto.price} onRemove={removeAlert} /> : null;
                }) : (
                    <div className="text-center text-muted-foreground py-10">
                        <p>You have no active alerts.</p>
                        <p className="text-sm">You can set price alerts from the trade screen.</p>
                    </div>
                )
            )}
             {(activeTab !== 'Limit' && activeTab !== 'Alerts') && (
                <div className="text-center text-muted-foreground py-10">
                    <p>No {activeTab.toLowerCase()} orders found.</p>
                </div>
            )}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
