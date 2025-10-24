
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { CryptoCurrency } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface OrderFormProps {
    crypto: CryptoCurrency;
}

export function OrderForm({ crypto }: OrderFormProps) {
  const [orderType, setOrderType] = React.useState('limit');

  return (
    <Card>
        <CardContent className="pt-6">
            <div className="grid grid-cols-2 gap-4 mb-4">
                <RadioGroup defaultValue="delivery" className="flex">
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="delivery" id="delivery"/>
                        <Label htmlFor="delivery">Delivery</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="hodl" id="hodl"/>
                        <Label htmlFor="hodl">HODL</Label>
                    </div>
                </RadioGroup>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <Label htmlFor="qty">Qty.</Label>
                    <Input id="qty" placeholder="0" type="number" />
                </div>
                <div>
                    <Label htmlFor="price">Price</Label>
                    <Input id="price" placeholder={crypto.price.toString()} type="number" disabled={orderType === 'market'} />
                </div>
            </div>

            <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                    <Label htmlFor="stop-loss">Set Stop Loss</Label>
                    <Switch id="stop-loss" />
                </div>
                 <div className="flex items-center justify-between">
                    <Label htmlFor="take-profit">Set Take Profit</Label>
                    <Switch id="take-profit" />
                </div>
            </div>
            
            <RadioGroup defaultValue="limit" onValueChange={setOrderType} className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="market" id="market"/>
                    <Label htmlFor="market">Market</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="limit" id="limit"/>
                    <Label htmlFor="limit">Limit</Label>
                </div>
            </RadioGroup>

            <div className="text-sm text-muted-foreground">
                Margin required: <span className="font-semibold text-foreground">$0.00</span>
            </div>

        </CardContent>
    </Card>
  );
}
