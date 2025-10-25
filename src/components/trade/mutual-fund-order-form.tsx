
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { MutualFund } from '@/lib/types';
import { SwipeToConfirm } from '../ui/swipe-to-confirm';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface MutualFundOrderFormProps {
    fund: MutualFund;
}

export function MutualFundOrderForm({ fund }: MutualFundOrderFormProps) {
    const [investmentType, setInvestmentType] = React.useState('one-time');
    const [amount, setAmount] = React.useState('');
    const { toast } = useToast();

    const [spPlanType, setSpPlanType] = React.useState('sip');
    const [sipInvestmentType, setSipInvestmentType] = React.useState<'amount' | 'qty'>('amount');
    const [swpWithdrawalType, setSwpWithdrawalType] = React.useState<'amount' | 'qty'>('amount');


    const handleSwipeConfirm = () => {
        if ((investmentType === 'one-time' || investmentType === 'hodl') && (!amount || parseFloat(amount) <= 0)) {
            toast({
                variant: 'destructive',
                title: 'Invalid Amount',
                description: 'Please enter a valid investment amount.',
            });
            return;
        }
        toast({
            title: 'Investment Successful',
            description: `Your investment in ${fund.name} is being processed.`,
        });
        // Here you would typically call an API to process the investment
        console.log(`Investing in ${fund.name}`);
    };

    return (
        <div>
            <div className="p-6">
                <RadioGroup value={investmentType} onValueChange={setInvestmentType} className="flex space-x-4 mb-6">
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="one-time" id="one-time"/>
                        <Label htmlFor="one-time">One-time</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="hodl" id="hodl"/>
                        <Label htmlFor="hodl">HODL</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="sp" id="sp"/>
                        <Label htmlFor="sp">Start SP</Label>
                    </div>
                </RadioGroup>
                
                {(investmentType === 'one-time' || investmentType === 'hodl') && (
                    <div className="space-y-2 mb-6">
                        <Label htmlFor="investment-amount">Investment Amount ($)</Label>
                        <Input 
                            id="investment-amount" 
                            placeholder="e.g., 5000" 
                            type="number" 
                            value={amount}
                            onChange={e => setAmount(e.target.value)} 
                        />
                    </div>
                )}
                
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

                <div className="mb-6">
                    <SwipeToConfirm onConfirm={handleSwipeConfirm} />
                </div>


                <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                    <div>
                        <p>NAV: {new Date(fund.navDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                        <p className="font-semibold text-foreground">${fund.nav.toFixed(2)}</p>
                    </div>
                    <div className="text-right">
                        <p>Rating</p>
                        <p className="font-semibold text-foreground">{fund.rating}</p>
                    </div>
                    <div>
                        <p>Min. SIP amount</p>
                        <p className="font-semibold text-foreground">${fund.minSipAmount.toLocaleString()}</p>
                    </div>
                     <div className="text-right">
                        <p>Fund Size</p>
                        <p className="font-semibold text-foreground">${(fund.fundSize / 10000000).toFixed(2)} Cr</p>
                    </div>
                </div>

            </div>
        </div>
    );
}
