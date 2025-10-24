
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { CryptoCurrency } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface OrderFormProps {
    crypto: CryptoCurrency;
}

export function OrderForm({ crypto }: OrderFormProps) {
  const [orderType, setOrderType] = React.useState('limit');
  const [investmentType, setInvestmentType] = React.useState('delivery');
  const [stopLossEnabled, setStopLossEnabled] = React.useState(false);
  const [takeProfitEnabled, setTakeProfitEnabled] = React.useState(false);
  const [stopLossType, setStopLossType] = React.useState<'price' | 'percentage'>('price');
  const [takeProfitType, setTakeProfitType] = React.useState<'price' | 'percentage'>('price');
  const [spPlanType, setSpPlanType] = React.useState('sip');
  const [sipInvestmentType, setSipInvestmentType] = React.useState<'amount' | 'qty'>('amount');
  const [swpWithdrawalType, setSwpWithdrawalType] = React.useState<'amount' | 'qty'>('amount');

  return (
    <Card>
        <CardContent className="pt-6">
            <RadioGroup value={investmentType} onValueChange={setInvestmentType} className="flex space-x-4 mb-4">
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="delivery" id="delivery"/>
                    <Label htmlFor="delivery">Delivery</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="hodl" id="hodl"/>
                    <Label htmlFor="hodl">HODL</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="sp" id="sp"/>
                    <Label htmlFor="sp">SP</Label>
                </div>
            </RadioGroup>
            
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

            {investmentType === 'hodl' && (
                <div className="space-y-4 mb-4">
                    <Label>Lock-in Period</Label>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="months" className="text-xs text-muted-foreground">Months</Label>
                            <Input id="months" placeholder="0" type="number" />
                        </div>
                        <div>
                            <Label htmlFor="years" className="text-xs text-muted-foreground">Years</Label>
                            <Input id="years" placeholder="0" type="number" />
                        </div>
                    </div>
                </div>
            )}
            
            {investmentType === 'sp' && (
                 <div className="mb-4 space-y-4">
                    <RadioGroup value={spPlanType} onValueChange={setSpPlanType} className="flex space-x-4">
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="sip" id="sip"/>
                            <Label htmlFor="sip">SIP</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="swp" id="swp"/>
                            <Label htmlFor="swp">SWP</Label>
                        </div>
                    </RadioGroup>

                    {spPlanType === 'sip' && (
                        <div className="space-y-4 p-4 border rounded-md">
                            <div className="space-y-2">
                                <Label>SIP Installment</Label>
                                <div className="flex gap-2">
                                    <Input placeholder="0.00" type="number" />
                                    <div className="flex rounded-md bg-muted p-1">
                                        <Button variant={sipInvestmentType === 'amount' ? 'default' : 'ghost'} size="sm" onClick={() => setSipInvestmentType('amount')} className="flex-1 text-xs px-2 h-auto data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">Amt</Button>
                                        <Button variant={sipInvestmentType === 'qty' ? 'default' : 'ghost'} size="sm" onClick={() => setSipInvestmentType('qty')} className="flex-1 text-xs px-2 h-auto data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">Qty</Button>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>SIP Mode</Label>
                                <Select defaultValue="monthly">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select mode" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="daily">Daily</SelectItem>
                                        <SelectItem value="weekly">Weekly</SelectItem>
                                        <SelectItem value="monthly">Monthly</SelectItem>
                                        <SelectItem value="annually">Annually</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}
                    
                    {spPlanType === 'swp' && (
                         <div className="space-y-4 p-4 border rounded-md">
                            <div className="space-y-2">
                                <Label>Lumpsum Amount</Label>
                                <Input placeholder="0.00" type="number" />
                            </div>
                            <div className="space-y-2">
                                <Label>Withdrawal</Label>
                                <div className="flex gap-2">
                                    <Input placeholder="0.00" type="number" />
                                     <div className="flex rounded-md bg-muted p-1">
                                        <Button variant={swpWithdrawalType === 'amount' ? 'default' : 'ghost'} size="sm" onClick={() => setSwpWithdrawalType('amount')} className="flex-1 text-xs px-2 h-auto data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">Amt</Button>
                                        <Button variant={swpWithdrawalType === 'qty' ? 'default' : 'ghost'} size="sm" onClick={() => setSwpWithdrawalType('qty')} className="flex-1 text-xs px-2 h-auto data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">Qty</Button>
                                    </div>
                                </div>
                            </div>
                             <div className="space-y-2">
                                <Label>Withdrawal Mode</Label>
                                <Select defaultValue="monthly">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select mode" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="daily">Daily</SelectItem>
                                        <SelectItem value="weekly">Weekly</SelectItem>
                                        <SelectItem value="monthly">Monthly</SelectItem>
                                        <SelectItem value="annually">Annually</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                         </div>
                    )}
                </div>
            )}

            <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                    <Label htmlFor="stop-loss">Set Stop Loss</Label>
                    <Switch id="stop-loss" checked={stopLossEnabled} onCheckedChange={setStopLossEnabled} />
                </div>
                {stopLossEnabled && (
                    <div className="flex gap-2">
                        <Input id="stop-loss-value" placeholder="0.00" type="number" />
                        <div className="flex rounded-md bg-muted p-1">
                            <Button variant={stopLossType === 'price' ? 'default' : 'ghost'} size="sm" onClick={() => setStopLossType('price')} className="flex-1 text-xs px-2 h-auto data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">$</Button>
                            <Button variant={stopLossType === 'percentage' ? 'default' : 'ghost'} size="sm" onClick={() => setStopLossType('percentage')} className="flex-1 text-xs px-2 h-auto data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">%</Button>
                        </div>
                    </div>
                )}
                 <div className="flex items-center justify-between">
                    <Label htmlFor="take-profit">Set Take Profit</Label>
                    <Switch id="take-profit" checked={takeProfitEnabled} onCheckedChange={setTakeProfitEnabled} />
                </div>
                 {takeProfitEnabled && (
                    <div className="flex gap-2">
                        <Input id="take-profit-value" placeholder="0.00" type="number" />
                        <div className="flex rounded-md bg-muted p-1">
                             <Button variant={takeProfitType === 'price' ? 'default' : 'ghost'} size="sm" onClick={() => setTakeProfitType('price')} className="flex-1 text-xs px-2 h-auto data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">$</Button>
                            <Button variant={takeProfitType === 'percentage' ? 'default' : 'ghost'} size="sm" onClick={() => setTakeProfitType('percentage')} className="flex-1 text-xs px-2 h-auto data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">%</Button>
                        </div>
                    </div>
                )}
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
