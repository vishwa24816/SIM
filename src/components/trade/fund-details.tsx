
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MutualFund } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Info, User, List, Briefcase, Calculator } from 'lucide-react';
import { Input } from '../ui/input';
import { Slider } from '../ui/slider';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';

interface FundDetailsProps {
    fund: MutualFund;
}


const FundCalculator = ({ fund }: { fund: MutualFund }) => {
    const [calculatorType, setCalculatorType] = React.useState('lumpsum');

    // Lumpsum state
    const [lumpsumAmount, setLumpsumAmount] = React.useState(100000);
    const [lumpsumPeriod, setLumpsumPeriod] = React.useState(10);
    const [lumpsumReturns, setLumpsumReturns] = React.useState(fund.change3y);

    const lumpsumFutureValue = lumpsumAmount * Math.pow(1 + (lumpsumReturns / 100), lumpsumPeriod);
    const lumpsumTotalInvestment = lumpsumAmount;
    const lumpsumGains = lumpsumFutureValue - lumpsumTotalInvestment;

    // SIP state
    const [sipAmount, setSipAmount] = React.useState(10000);
    const [sipPeriod, setSipPeriod] = React.useState(10);
    const [sipReturns, setSipReturns] = React.useState(fund.change3y);

    const monthlySipRate = sipReturns / 100 / 12;
    const sipMonths = sipPeriod * 12;
    const sipFutureValue = sipAmount * ((Math.pow(1 + monthlySipRate, sipMonths) - 1) / monthlySipRate) * (1 + monthlySipRate);
    const sipTotalInvestment = sipAmount * sipMonths;
    const sipGains = sipFutureValue - sipTotalInvestment;
    
    // SWP state
    const [swpInvestment, setSwpInvestment] = React.useState(1000000);
    const [swpWithdrawal, setSwpWithdrawal] = React.useState(8000);
    const [swpReturns, setSwpReturns] = React.useState(fund.change3y);

    const monthlySwpRate = swpReturns / 100 / 12;
    let swpYears = 0;
    if (swpWithdrawal > swpInvestment * monthlySwpRate) {
        swpYears = Math.log((swpWithdrawal) / (swpWithdrawal - (swpInvestment * monthlySwpRate))) / Math.log(1 + monthlySwpRate) / 12;
    } else {
        swpYears = Infinity;
    }


    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
    }
    
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-3">
                    <Calculator className="w-5 h-5 text-primary" />
                    <CardTitle className="text-lg">Investment Calculator</CardTitle>
                </div>
            </CardHeader>
            <CardContent>
                <RadioGroup value={calculatorType} onValueChange={setCalculatorType} className="grid grid-cols-3 gap-2 rounded-md bg-muted p-1 mb-6">
                    <Label htmlFor='lumpsum-calc' className={cn('text-center p-1.5 rounded-md cursor-pointer', calculatorType === 'lumpsum' && 'bg-background shadow-sm')}>Lumpsum</Label>
                    <RadioGroupItem value="lumpsum" id="lumpsum-calc" className="sr-only" />
                    
                    <Label htmlFor='sip-calc' className={cn('text-center p-1.5 rounded-md cursor-pointer', calculatorType === 'sip' && 'bg-background shadow-sm')}>SIP</Label>
                    <RadioGroupItem value="sip" id="sip-calc" className="sr-only" />
                    
                    <Label htmlFor='swp-calc' className={cn('text-center p-1.5 rounded-md cursor-pointer', calculatorType === 'swp' && 'bg-background shadow-sm')}>SWP</Label>
                    <RadioGroupItem value="swp" id="swp-calc" className="sr-only" />
                </RadioGroup>

                {calculatorType === 'lumpsum' && (
                    <div className='space-y-6'>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <Label htmlFor="lumpsum-amount">Total Investment</Label>
                                <Input id="lumpsum-amount" className="w-32" value={formatCurrency(lumpsumAmount)} readOnly />
                            </div>
                            <Slider value={[lumpsumAmount]} onValueChange={(v) => setLumpsumAmount(v[0])} min={500} max={5000000} step={500} />
                        </div>
                        <div className="space-y-2">
                             <div className="flex justify-between items-center">
                                <Label htmlFor="lumpsum-period">Period (Years)</Label>
                                <Input id="lumpsum-period" className="w-20" value={lumpsumPeriod} readOnly />
                            </div>
                            <Slider value={[lumpsumPeriod]} onValueChange={(v) => setLumpsumPeriod(v[0])} min={1} max={40} step={1} />
                        </div>
                         <div className="space-y-2">
                             <div className="flex justify-between items-center">
                                <Label htmlFor="lumpsum-returns">Expected Return (%)</Label>
                                <Input id="lumpsum-returns" className="w-20" value={lumpsumReturns.toFixed(1)} readOnly />
                            </div>
                            <Slider value={[lumpsumReturns]} onValueChange={(v) => setLumpsumReturns(v[0])} min={1} max={30} step={0.1} />
                        </div>

                        <div className="text-center bg-muted p-4 rounded-lg space-y-2">
                            <p className="text-sm">Future Value</p>
                            <p className="text-2xl font-bold">{formatCurrency(lumpsumFutureValue)}</p>
                            <p className="text-sm text-muted-foreground">Total Investment: {formatCurrency(lumpsumTotalInvestment)} | Gains: {formatCurrency(lumpsumGains)}</p>
                        </div>
                    </div>
                )}
                
                {calculatorType === 'sip' && (
                    <div className='space-y-6'>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <Label htmlFor="sip-amount">Monthly Investment</Label>
                                <Input id="sip-amount" className="w-32" value={formatCurrency(sipAmount)} readOnly />
                            </div>
                            <Slider value={[sipAmount]} onValueChange={(v) => setSipAmount(v[0])} min={500} max={100000} step={500} />
                        </div>
                        <div className="space-y-2">
                             <div className="flex justify-between items-center">
                                <Label htmlFor="sip-period">Period (Years)</Label>
                                <Input id="sip-period" className="w-20" value={sipPeriod} readOnly />
                            </div>
                            <Slider value={[sipPeriod]} onValueChange={(v) => setSipPeriod(v[0])} min={1} max={40} step={1} />
                        </div>
                         <div className="space-y-2">
                             <div className="flex justify-between items-center">
                                <Label htmlFor="sip-returns">Expected Return (%)</Label>
                                <Input id="sip-returns" className="w-20" value={sipReturns.toFixed(1)} readOnly />
                            </div>
                            <Slider value={[sipReturns]} onValueChange={(v) => setSipReturns(v[0])} min={1} max={30} step={0.1} />
                        </div>
                        <div className="text-center bg-muted p-4 rounded-lg space-y-2">
                            <p className="text-sm">Future Value</p>
                            <p className="text-2xl font-bold">{formatCurrency(sipFutureValue)}</p>
                            <p className="text-sm text-muted-foreground">Total Investment: {formatCurrency(sipTotalInvestment)} | Gains: {formatCurrency(sipGains)}</p>
                        </div>
                    </div>
                )}
                
                {calculatorType === 'swp' && (
                    <div className='space-y-6'>
                         <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <Label htmlFor="swp-investment">Total Investment</Label>
                                <Input id="swp-investment" className="w-32" value={formatCurrency(swpInvestment)} readOnly />
                            </div>
                            <Slider value={[swpInvestment]} onValueChange={(v) => setSwpInvestment(v[0])} min={100000} max={10000000} step={10000} />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <Label htmlFor="swp-withdrawal">Monthly Withdrawal</Label>
                                <Input id="swp-withdrawal" className="w-32" value={formatCurrency(swpWithdrawal)} readOnly />
                            </div>
                            <Slider value={[swpWithdrawal]} onValueChange={(v) => setSwpWithdrawal(v[0])} min={1000} max={100000} step={1000} />
                        </div>
                         <div className="space-y-2">
                             <div className="flex justify-between items-center">
                                <Label htmlFor="swp-returns">Expected Return (%)</Label>
                                <Input id="swp-returns" className="w-20" value={swpReturns.toFixed(1)} readOnly />
                            </div>
                            <Slider value={[swpReturns]} onValueChange={(v) => setSwpReturns(v[0])} min={1} max={30} step={0.1} />
                        </div>
                        <div className="text-center bg-muted p-4 rounded-lg space-y-2">
                            <p className="text-sm">Your money will last for</p>
                            <p className="text-2xl font-bold">{isFinite(swpYears) ? `${Math.floor(swpYears)} Years and ${Math.round((swpYears % 1) * 12)} Months` : 'Forever'}</p>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export function FundDetails({ fund }: FundDetailsProps) {
    const [activeTab, setActiveTab] = React.useState('About Fund');
    const tabs = ['About Fund', 'Calculator'];

    return (
        <div>
            <div className="border-b border-border">
                <div className="overflow-x-auto px-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground whitespace-nowrap">
                        {tabs.map(tab => (
                            <Button
                                key={tab}
                                variant="ghost"
                                size="sm"
                                onClick={() => setActiveTab(tab)}
                                className={cn("px-3", activeTab === tab && 'text-primary')}
                            >
                                {tab}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="p-4 space-y-6">
                {activeTab === 'About Fund' && (
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <Info className="w-5 h-5 text-primary" />
                                    <CardTitle className="text-lg">About the Fund</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">{fund.about}</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <User className="w-5 h-5 text-primary" />
                                    <CardTitle className="text-lg">Fund Management</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-4">
                                    <Avatar className="w-16 h-16">
                                        <AvatarFallback>{fund.fundManager.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold">{fund.fundManager.name}</p>
                                        <p className="text-sm text-muted-foreground">{fund.fundManager.title}</p>
                                        <p className="text-xs text-muted-foreground">{fund.fundManager.company}</p>
                                    </div>
                                </div>
                                <p className="text-sm text-muted-foreground mt-4">{fund.fundManager.bio}</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <Briefcase className="w-5 h-5 text-primary" />
                                    <CardTitle className="text-lg">Top Holdings ({fund.topHoldings.length})</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-3">
                                    {fund.topHoldings.map(holding => (
                                        <li key={holding.name} className="flex justify-between items-center text-sm">
                                            <span>{holding.name} ({holding.symbol})</span>
                                            <span className="font-medium">{holding.percentage.toFixed(2)}%</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                )}
                {activeTab === 'Calculator' && <FundCalculator fund={fund} />}
            </div>
        </div>
    );
}
