
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { CryptoCurrency } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { GeneralOrderConfig } from './order-form';


interface FuturesOrderFormProps {
    crypto: CryptoCurrency;
    price: string;
    setPrice: (price: string) => void;
    orderType: string;
    setOrderType: (type: string) => void;
    investmentType: string;
    setInvestmentType: (type: string) => void;
    quantity: string;
    setQuantity: (qty: string) => void;
    leverage: string;
    setLeverage: (lev: string) => void;
    onGeneralOrderConfigChange: (config: GeneralOrderConfig | null) => void;
}

const leverageOptions = [1, 2, 3, 4, 5, 10, 20, 25, 50, 100, 200];

export function FuturesOrderForm({ 
    crypto, price, setPrice, orderType, setOrderType, investmentType, setInvestmentType, 
    quantity, setQuantity, leverage, setLeverage, onGeneralOrderConfigChange 
}: FuturesOrderFormProps) {
  const [stopLossEnabled, setStopLossEnabled] = React.useState(false);
  const [takeProfitEnabled, setTakeProfitEnabled] = React.useState(false);
  const [trailingStopLossEnabled, setTrailingStopLossEnabled] = React.useState(false);
  const [stopLossValue, setStopLossValue] = React.useState('');
  const [takeProfitValue, setTakeProfitValue] = React.useState('');
  const [trailingStopLossValue, setTrailingStopLossValue] = React.useState('');
  const [stopLossType, setStopLossType] = React.useState<'price' | 'percentage'>('price');
  const [takeProfitType, setTakeProfitType] = React.useState<'price' | 'percentage'>('price');
  const { toast } = useToast();

  const [months, setMonths] = React.useState('');

  const handleMonthsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (parseInt(value, 10) > 12) {
      toast({
        variant: 'destructive',
        title: 'Invalid Month',
        description: 'The lock-in period for months cannot exceed 12.',
      });
      setMonths('');
    } else {
      setMonths(value);
    }
  };
  
  const selectedLeverage = parseInt(leverage, 10);

  const marginRequired = React.useMemo(() => {
    const qty = parseFloat(quantity);
    const prc = parseFloat(price) || (orderType === 'market' ? crypto.price : 0);
    if (!qty || !prc) return 0;
    return (qty * prc) / selectedLeverage;
  }, [quantity, price, orderType, crypto.price, selectedLeverage]);


  React.useEffect(() => {
    if (investmentType === 'hodl' && selectedLeverage > 5) {
        setInvestmentType('delivery');
    }
  }, [selectedLeverage, investmentType, setInvestmentType]);
  
  React.useEffect(() => {
    onGeneralOrderConfigChange({
        stopLoss: stopLossEnabled ? stopLossValue : undefined,
        takeProfit: takeProfitEnabled ? takeProfitValue : undefined,
        trailingStopLoss: trailingStopLossEnabled ? trailingStopLossValue : undefined,
        stopLossType,
        takeProfitType
    });
  }, [stopLossEnabled, takeProfitEnabled, trailingStopLossEnabled, stopLossValue, takeProfitValue, trailingStopLossValue, stopLossType, takeProfitType, onGeneralOrderConfigChange]);

  const handleStopLossToggle = (checked: boolean) => {
    setStopLossEnabled(checked);
    if (checked && trailingStopLossEnabled) {
      setTrailingStopLossEnabled(false);
    }
  };

  const handleTrailingStopLossToggle = (checked: boolean) => {
    setTrailingStopLossEnabled(checked);
    if (checked && stopLossEnabled) {
      setStopLossEnabled(false);
    }
  };


  return (
    <div>
        <div className="pt-6 p-6">
            <RadioGroup value={investmentType} onValueChange={setInvestmentType} className="flex space-x-4 mb-4">
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="delivery" id="delivery"/>
                    <Label htmlFor="delivery">Delivery</Label>
                </div>
                {selectedLeverage <= 5 && (
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="hodl" id="hodl"/>
                        <Label htmlFor="hodl">HODL</Label>
                    </div>
                )}
            </RadioGroup>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <Label htmlFor="qty">Qty.</Label>
                    <Input id="qty" placeholder="0" type="number" value={quantity} onChange={e => setQuantity(e.target.value)} />
                </div>
                <div>
                    <Label htmlFor="price">Price</Label>
                    <Input id="price" placeholder={crypto.price.toString()} type="number" disabled={orderType === 'market'} value={price} onChange={e => setPrice(e.target.value)} />
                </div>
            </div>

            <div className="mb-4">
                <Label htmlFor="leverage">Leverage</Label>
                <Select value={leverage} onValueChange={setLeverage}>
                    <SelectTrigger id="leverage">
                        <SelectValue placeholder="Select leverage" />
                    </SelectTrigger>
                    <SelectContent>
                        {leverageOptions.map(option => (
                             <SelectItem key={option} value={option.toString()}>{option}x</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {investmentType === 'hodl' && (
                <div className="space-y-4 mb-4">
                    <Label>Lock-in Period</Label>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="months" className="text-xs text-muted-foreground">Months</Label>
                            <Input id="months" placeholder="0" type="number" value={months} onChange={handleMonthsChange} max="12" />
                        </div>
                        <div>
                            <Label htmlFor="years" className="text-xs text-muted-foreground">Years</Label>
                            <Input id="years" placeholder="0" type="number" />
                        </div>
                    </div>
                </div>
            )}
            
            <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                    <Label htmlFor="stop-loss" className={trailingStopLossEnabled ? 'text-muted-foreground' : ''}>Set Stop Loss</Label>
                    <Switch id="stop-loss" checked={stopLossEnabled} onCheckedChange={handleStopLossToggle} disabled={trailingStopLossEnabled} />
                </div>
                {stopLossEnabled && (
                    <div className="flex gap-2">
                        <Input id="stop-loss-value" placeholder="0.00" type="number" value={stopLossValue} onChange={e => setStopLossValue(e.target.value)} />
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
                        <Input id="take-profit-value" placeholder="0.00" type="number" value={takeProfitValue} onChange={e => setTakeProfitValue(e.target.value)} />
                        <div className="flex rounded-md bg-muted p-1">
                             <Button variant={takeProfitType === 'price' ? 'default' : 'ghost'} size="sm" onClick={() => setTakeProfitType('price')} className="flex-1 text-xs px-2 h-auto data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">$</Button>
                            <Button variant={takeProfitType === 'percentage' ? 'default' : 'ghost'} size="sm" onClick={() => setTakeProfitType('percentage')} className="flex-1 text-xs px-2 h-auto data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">%</Button>
                        </div>
                    </div>
                )}
                <div className="flex items-center justify-between">
                    <Label htmlFor="trailing-stop-loss" className={stopLossEnabled ? 'text-muted-foreground' : ''}>Trailing Stop Loss</Label>
                    <Switch id="trailing-stop-loss" checked={trailingStopLossEnabled} onCheckedChange={handleTrailingStopLossToggle} disabled={stopLossEnabled} />
                </div>
                {trailingStopLossEnabled && (
                    <div className="flex gap-2">
                        <Input id="trailing-stop-loss-value" placeholder="e.g., 2" type="number" value={trailingStopLossValue} onChange={e => setTrailingStopLossValue(e.target.value)} />
                        <div className="flex items-center px-3 rounded-md bg-muted text-sm">%</div>
                    </div>
                )}
            </div>
            
            <RadioGroup value={orderType} onValueChange={setOrderType} className="grid grid-cols-2 gap-4 mb-4">
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
                Margin required: <span className="font-semibold text-foreground">${marginRequired.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>

        </div>
    </div>
  );
}
