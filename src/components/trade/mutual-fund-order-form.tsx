
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { MutualFund } from '@/lib/types';
import { SwipeToConfirm } from '../ui/swipe-to-confirm';
import { useToast } from '@/hooks/use-toast';

interface MutualFundOrderFormProps {
    fund: MutualFund;
}

export function MutualFundOrderForm({ fund }: MutualFundOrderFormProps) {
    const [investmentType, setInvestmentType] = React.useState('one-time');
    const [amount, setAmount] = React.useState('');
    const { toast } = useToast();

    const handleSwipeConfirm = () => {
        if (!amount || parseFloat(amount) <= 0) {
            toast({
                variant: 'destructive',
                title: 'Invalid Amount',
                description: 'Please enter a valid investment amount.',
            });
            return;
        }
        toast({
            title: 'Investment Successful',
            description: `Your investment of $${amount} in ${fund.name} is being processed.`,
        });
        // Here you would typically call an API to process the investment
        console.log(`Investing $${amount} in ${fund.name}`);
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

                <SwipeToConfirm onConfirm={handleSwipeConfirm} />

                <div className="grid grid-cols-2 gap-4 text-sm mt-6 text-muted-foreground">
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
