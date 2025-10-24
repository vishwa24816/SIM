'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Header } from '@/components/dashboard/header';
import { Home, ListOrdered, Bitcoin, Globe, Search, BarChart2 } from 'lucide-react';
import Link from 'next/link';

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

export default function OrdersPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-1 overflow-y-auto">
        <div className="border-b border-border">
          <div className="px-4 overflow-x-auto">
            <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground whitespace-nowrap">
              <Button variant="ghost" className="text-primary px-3">Limit</Button>
              <Button variant="ghost" className="px-3">GTT</Button>
              <Button variant="ghost" className="px-3">Bids</Button>
              <Button variant="ghost" className="px-3">HODL</Button>
              <Button variant="ghost" className="px-3">Baskets</Button>
              <Button variant="ghost" className="px-3">SIPs</Button>
              <Button variant="ghost" className="px-3">Alerts</Button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 border-b border-border">
            <Search className="h-5 w-5 text-muted-foreground" />
            <Button variant="link" className="text-primary">
                <BarChart2 className="h-4 w-4 mr-2" />
                Analytics
            </Button>
        </div>

        <div className="p-4 space-y-4">
            {orders.map(order => (
                <OrderCard key={order.id} order={order} />
            ))}
        </div>
      </main>
      <footer className="sticky bottom-0 z-50 mt-auto bg-card/90 backdrop-blur-sm border-t">
        <nav className="flex justify-around items-center h-16 px-4">
          <Link href="/" legacyBehavior passHref>
            <Button variant="ghost" className="flex flex-col h-auto items-center text-muted-foreground">
              <Home className="h-6 w-6" />
              <span className="text-xs">Home</span>
            </Button>
          </Link>
          <Link href="/orders" legacyBehavior passHref>
            <Button variant="ghost" className="flex flex-col h-auto items-center text-primary">
              <ListOrdered className="h-6 w-6" />
              <span className="text-xs">Orders</span>
            </Button>
          </Link>
          <Button variant="ghost" className="flex flex-col h-auto items-center text-muted-foreground">
            <Bitcoin className="h-6 w-6" />
            <span className="text-xs">Crypto</span>
          </Button>
          <Button variant="ghost" className="flex flex-col h-auto items-center text-muted-foreground">
            <Globe className="h-6 w-6" />
            <span className="text-xs">Web3</span>
          </Button>
        </nav>
      </footer>
    </div>
  );
}
