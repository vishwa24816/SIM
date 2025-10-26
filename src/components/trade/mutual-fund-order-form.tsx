
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { MutualFund, SPFrequency, SystematicPlan, SystematicPlanType } from '@/lib/types';
import { SwipeToConfirm } from '../ui/swipe-to-confirm';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { BellRing, Briefcase } from 'lucide-react';
import { useAlerts } from '@/hooks/use-alerts';
import { AddToBasketForm } from './add-to-basket-form';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { useSystematicPlans } from '@/hooks/use-systematic-plans';

interface MutualFundOrderFormProps {
    fund: MutualFund;
}

export function MutualFundOrderForm({ fund }: MutualFundOrderFormProps) {
    const [investmentType, setInvestmentType] = React.useState('one-time');
    const [amount, setAmount] = React.useState('');
    const { toast } = useToast();
    const { addAlert } = useAlerts();
    const { addPlan } = useSystematicPlans();

    const [isSettingAlert, setIsSettingAlert] = React.useState(false);
    const [alertPrice, setAlertPrice] = React.useState('');
    const [isAddingToBasket, setIsAddingToBasket] = React.useState(false);

    const [spPlanType, setSpPlanType] = React.useState<SystematicPlanType>('sip');
    const [sipInvestmentType, setSipInvestmentType] = React.useState<'amount' | 'qty'>('amount');
    const [spAmount, setSpAmount] = React.useState('');
    const [spFrequency, setSpFrequency] = React.useState<SPFrequency>('monthly');

    const canAddToBasket = React.useMemo(() => {
        if (investmentType === 'sp') return false;
        const numericAmount = parseFloat(amount);
        return !isNaN(numericAmount) && numericAmount > 0;
    }, [amount, investmentType]);


    const handleSwipeConfirm = () => {
        if (investmentType === 'one-time' || investmentType === 'hodl') {
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
                description: `Your investment in ${fund.name} is being processed.`,
            });
            console.log(`Investing ${amount} in ${fund.name}`);
        } else if (investmentType === 'sp') {
             const numericAmount = parseFloat(spAmount);
            if (isNaN(numericAmount) || numericAmount <= 0) {
            toast({ variant: 'destructive', title: 'Invalid Amount', description: `Please enter a valid ${spPlanType === 'sip' ? 'investment' : 'withdrawal'} amount.`});
            return;
            }

            const plan: Omit<SystematicPlan, 'id' | 'createdAt' | 'status'> = {
                instrumentId: fund.id,
                instrumentName: fund.name,
                instrumentSymbol: fund.symbol,
                planType: spPlanType,
                amount: numericAmount,
                frequency: spFrequency,
                investmentType: sipInvestmentType,
            };

            addPlan({
                ...plan,
                id: `${fund.id}-${spPlanType}-${Date.now()}`,
                createdAt: new Date().toISOString(),
                status: 'active'
            } as SystematicPlan);

            toast({ title: 'Systematic Plan Created', description: `Your ${spPlanType.toUpperCase()} for ${fund.name} has been set up.`});
            setSpAmount('');
        }
    };
    
    const handleSetAlert = () => {
        const price = parseFloat(alertPrice);
        if (isNaN(price) || price <= 0) {
            toast({
                variant: 'destructive',
                title: 'Invalid Price',
                description: 'Please enter a valid NAV for the alert.'
            });
            return;
        }
        addAlert({
            id: `${fund.id}-${price}-${Date.now()}`,
            cryptoId: fund.id,
            cryptoSymbol: fund.symbol,
            price: price,
            status: 'active',
            createdAt: new Date().toISOString(),
        });
        toast({
            title: 'Alert Set!',
            description: `You will be notified when ${fund.symbol} NAV reaches $${price}.`
        });
        setIsSettingAlert(false);
        setAlertPrice('');
    };
    
    const quantity = React.useMemo(() => {
        const numericAmount = parseFloat(amount);
        if (isNaN(numericAmount) || numericAmount <= 0 || fund.nav <=0) return 0;
        return numericAmount / fund.nav;
    }, [amount, fund.nav]);


    return (
        <>
            <Collapsible open={isAddingToBasket} onOpenChange={setIsAddingToBasket}>
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
                                    <Input id="months" placeholder="0" type="number" max="12" />
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
                             <RadioGroup value={spPlanType} onValueChange={(v) => setSpPlanType(v as SystematicPlanType)} className="flex space-x-4">
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="sip" id="sip"/>
                                    <Label htmlFor="sip">SIP</Label>
                                </div>
                                 {/* SWP is not applicable for Mutual Funds in this context */}
                            </RadioGroup>

                            {spPlanType === 'sip' && (
                                <div className="space-y-4 p-4 border rounded-md">
                                    <div className="space-y-2">
                                        <Label>SIP Installment Amount</Label>
                                        <Input placeholder="0.00" type="number" value={spAmount} onChange={e => setSpAmount(e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>SIP Frequency</Label>
                                        <Select value={spFrequency} onValueChange={(v) => setSpFrequency(v as SPFrequency)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select mode" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="weekly">Weekly</SelectItem>
                                                <SelectItem value="monthly">Monthly</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="mb-6">
                        <SwipeToConfirm onConfirm={handleSwipeConfirm} text={investmentType === 'sp' ? 'Start Plan' : 'Swipe to Invest'} />
                    </div>


                    <div className="grid grid-cols-2 gap-4 mt-6">
                        <CollapsibleTrigger asChild>
                            <Button variant="outline" disabled={!canAddToBasket}>
                                <Briefcase className="w-4 h-4 mr-2" />
                                Add to Basket
                            </Button>
                        </CollapsibleTrigger>
                        <Button variant="outline" onClick={() => setIsSettingAlert(!isSettingAlert)}>
                            <BellRing className="w-4 h-4 mr-2"/>
                            Add Alert
                        </Button>
                    </div>
                    {isSettingAlert && (
                        <div className="mt-4 space-y-2">
                            <p className="text-sm font-medium">Set a NAV alert for {fund.symbol}</p>
                            <div className="flex gap-2">
                                <Input 
                                    type="number" 
                                    placeholder={`Current: ${fund.nav.toFixed(2)}`}
                                    value={alertPrice}
                                    onChange={(e) => setAlertPrice(e.target.value)}
                                />
                                <Button onClick={handleSetAlert}>Set Alert</Button>
                            </div>
                        </div>
                    )}
                    
                    <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground mt-6">
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
                <CollapsibleContent>
                    <AddToBasketForm
                        instrument={{ id: fund.id, name: fund.name, symbol: fund.symbol, assetType: 'Mutual Fund' }}
                        orderState={{ price: fund.nav.toString(), quantity: quantity.toString(), orderType: 'one-time', investmentType }}
                        onClose={() => setIsAddingToBasket(false)}
                    />
                </CollapsibleContent>
            </Collapsible>
        </>
    );
}
