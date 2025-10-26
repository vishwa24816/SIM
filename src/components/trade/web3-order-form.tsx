
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CryptoCurrency } from '@/lib/types';
import { SwipeToConfirm } from '../ui/swipe-to-confirm';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { BellRing } from 'lucide-react';
import { useAlerts } from '@/hooks/use-alerts';

interface Web3OrderFormProps {
    crypto: CryptoCurrency;
}

export function Web3OrderForm({ crypto }: Web3OrderFormProps) {
    const [investmentType, setInvestmentType] = React.useState('one-time');
    const [amount, setAmount] = React.useState('');
    const { toast } = useToast();
    const { addAlert } = useAlerts();
    const [isSettingAlert, setIsSettingAlert] = React.useState(false);
    const [alertPrice, setAlertPrice] = React.useState('');

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
            description: `Your investment in ${crypto.name} is being processed.`,
        });
        console.log(`Investing in ${crypto.name}`);
    };

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
                </RadioGroup>
                
                <div className="space-y-2 mb-6">
                    <Label htmlFor="investment-amount">Investment Amount ($)</Label>
                    <Input 
                        id="investment-amount" 
                        placeholder="e.g., 500" 
                        type="number" 
                        value={amount}
                        onChange={e => setAmount(e.target.value)} 
                    />
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

                <div className="mb-6">
                    <SwipeToConfirm onConfirm={handleSwipeConfirm} />
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
                
                <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground mt-6">
                    <div>
                        <p>Price</p>
                        <p className="font-semibold text-foreground">${crypto.price.toFixed(crypto.price < 1 ? 6 : 2)}</p>
                    </div>
                    <div className="text-right">
                        <p>24h Change</p>
                        <p className={cn("font-semibold", crypto.change24h >= 0 ? "text-green-500" : "text-red-500")}>
                            {crypto.change24h.toFixed(2)}%
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}
