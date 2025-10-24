
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { List } from 'lucide-react';
import { Button } from '@/components/ui/button';

const dummyBuyOrders = [
    { total: 137, price: -0.05 },
    { total: 179, price: -0.10 },
    { total: 141, price: -0.15 },
    { total: 185, price: -0.21 },
    { total: 204, price: -0.26 },
]

const dummySellOrders = [
    { total: 169, price: 0.05 },
    { total: 229, price: 0.11 },
    { total: 196, price: 0.15 },
    { total: 94, price: 0.19 },
    { total: 60, price: 0.26 },
]

export function MarketDepth() {
  return (
    <Card>
        <CardHeader>
            <div className="flex items-center gap-2">
                <List className="h-5 w-5" />
                <CardTitle className="text-lg">Market Depth</CardTitle>
            </div>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-2 gap-4 text-center text-sm">
                <div>
                    <h4 className="font-semibold mb-2">Buy Orders <span className="text-muted-foreground font-normal">Total: 846</span></h4>
                    <div className="space-y-1">
                        {dummyBuyOrders.map((order, i) => (
                             <div key={i} className="grid grid-cols-2 items-center p-1 rounded-sm bg-green-500/10">
                                <span>{order.total}</span>
                                <span className="text-green-500">@{order.price.toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                </div>
                 <div>
                    <h4 className="font-semibold mb-2">Sell Orders <span className="text-muted-foreground font-normal">Total: 748</span></h4>
                    <div className="space-y-1">
                        {dummySellOrders.map((order, i) => (
                             <div key={i} className="grid grid-cols-2 items-center p-1 rounded-sm bg-red-500/10">
                                <span className="text-red-500">@{order.price.toFixed(2)}</span>
                                <span>{order.total}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6">
                <Button variant="outline">Add to Basket</Button>
                <Button variant="outline">Add Alert</Button>
            </div>
        </CardContent>
    </Card>
  );
}
