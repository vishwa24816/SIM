
"use client";

import * as React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { CryptoCurrency, Holding, Portfolio } from "@/lib/types";
import { PieChart, ArrowUp, ArrowDown, List, BarChart, Grid } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "../ui/button";
import { usePortfolioStore } from "@/hooks/use-portfolio";
import { Badge } from "../ui/badge";
import { useUser, useFirestore } from "@/firebase";
import { BarChart as RechartsBarChart, PieChart as RechartsPieChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Pie, Cell } from 'recharts';


interface CryptoPositionsProps {
  portfolio: Portfolio;
  marketData: CryptoCurrency[];
}

const HoldingsAccordion = ({ holdings }: { holdings: any[] }) => {
  const { sell } = usePortfolioStore();
  const { user } = useUser();
  const firestore = useFirestore();

  if (holdings.length === 0) {
    return (
      <div className="flex items-center justify-center h-24 rounded-lg bg-secondary/50">
        <p className="text-muted-foreground">You have no holdings.</p>
      </div>
    );
  }

  const getAssetPath = (item: { assetType?: string, id: string }) => {
    switch (item.assetType) {
        case 'Crypto ETF': return `/trade/etf/${item.id}`;
        case 'Mutual Fund': return `/trade/mutual-fund/${item.id}`;
        case 'Web3': return `/trade/web3/${item.id}`;
        case 'Futures': return `/trade/futures/${item.id}`;
        case 'Spot': return `/trade/${item.id}`;
        default: return `/crypto/${item.id}`;
    }
  }

  const handleSell = (crypto: CryptoCurrency, amount: number) => {
    if (!user || !firestore) return;
    sell(user, firestore, crypto, amount);
  }

  return (
    <Accordion type="single" collapsible className="w-full">
      {holdings.map((holding) => {
        const entryPrice = holding.margin > 0 && holding.amount > 0 ? holding.margin / holding.amount : 0;
        const pnl = holding.value - holding.margin;
        const pnlPercent = holding.margin > 0 ? (pnl / holding.margin) * 100 : 0;

        return (
          <AccordionItem value={holding.crypto.id} key={holding.crypto.id}>
            <AccordionTrigger>
              <div className="flex items-center gap-3 w-full">
                <div className="font-semibold">{holding.crypto.name}</div>
                <div className="text-xs text-muted-foreground">{holding.crypto.symbol}</div>
                <div className="ml-auto text-right">
                  <div className="font-mono font-semibold">
                    ₹{holding.value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div className={cn("text-sm flex items-center justify-end gap-1", pnl >= 0 ? "text-green-500" : "text-red-500")}>
                     {pnl >= 0 ? <ArrowUp className="h-3 w-3"/> : <ArrowDown className="h-3 w-3"/>}
                     <span>{pnl.toFixed(2)} ({pnlPercent.toFixed(2)}%)</span>
                  </div>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="p-2 bg-muted/50 rounded-md">
                  <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                      <div>
                          <p className="text-muted-foreground">Quantity</p>
                          <p className="font-semibold">{holding.amount.toFixed(6)}</p>
                      </div>
                      <div className="text-right">
                          <p className="text-muted-foreground">Avg. Buy Price</p>
                          <p className="font-semibold">₹{entryPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: entryPrice < 1 ? 6 : 2 })}</p>
                      </div>
                      <div>
                          <p className="text-muted-foreground">Current Price</p>
                          <p className="font-semibold">₹{holding.crypto.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: holding.crypto.price < 1 ? 6 : 2 })}</p>
                      </div>
                       <div className="text-right">
                          <p className="text-muted-foreground">Total Investment</p>
                          <p className="font-semibold">₹{holding.margin.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                      </div>
                  </div>
                  {(holding.stopLoss || holding.takeProfit || holding.trailingStopLoss) && (
                    <div className="grid grid-cols-2 gap-4 pt-2 mt-2 border-t text-sm mb-4">
                        <div>
                            <p className="text-muted-foreground">Stop Loss</p>
                            <p className="font-semibold text-red-500">{holding.stopLoss ? `₹${holding.stopLoss}` : 'Not Set'}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-muted-foreground">Take Profit</p>
                            <p className="font-semibold text-green-500">{holding.takeProfit ? `₹${holding.takeProfit}` : 'Not Set'}</p>
                        </div>
                        {holding.trailingStopLoss && (
                           <div>
                              <p className="text-muted-foreground">Trailing SL</p>
                              <p className="font-semibold text-orange-500">{holding.trailingStopLoss.percentage}%</p>
                          </div>
                        )}
                    </div>
                  )}
                  <div className="flex gap-2 mt-4">
                      <Link href={`${getAssetPath(holding.crypto)}?modify=true`} passHref className="w-full">
                          <Button size="sm" variant="outline" className="w-full">Modify</Button>
                      </Link>
                      <Button size="sm" variant="destructive" className="w-full" onClick={() => handleSell(holding.crypto, holding.amount)}>Square Off</Button>
                  </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        )
      })}
    </Accordion>
  );
};

const HoldingsBarChart = ({ holdings }: { holdings: any[] }) => {
    if (holdings.length === 0) return null;
    return (
        <ResponsiveContainer width="100%" height={300}>
            <RechartsBarChart data={holdings} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="crypto.symbol" />
                <YAxis />
                <Tooltip formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Value']} />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" name="Holding Value (₹)" />
            </RechartsBarChart>
        </ResponsiveContainer>
    );
};

const HoldingsPieChart = ({ holdings }: { holdings: any[] }) => {
    if (holdings.length === 0) return null;
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
    return (
        <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
                <Pie data={holdings} dataKey="value" nameKey="crypto.name" cx="50%" cy="50%" outerRadius={100} label>
                    {holdings.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip formatter={(value: number) => `₹${value.toLocaleString()}`} />
                <Legend />
            </RechartsPieChart>
        </ResponsiveContainer>
    );
};

const HoldingsHeatmap = ({ holdings }: { holdings: any[] }) => {
    if (holdings.length === 0) return null;
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {holdings.map(holding => {
                const pnl = holding.value - holding.margin;
                const pnlPercent = holding.margin > 0 ? (pnl / holding.margin) * 100 : 0;
                const bgColor = pnl >= 0 ? 'bg-green-500/20' : 'bg-red-500/20';
                return (
                    <div key={holding.crypto.id} className={cn('p-4 rounded-lg', bgColor)}>
                        <p className="font-bold">{holding.crypto.symbol}</p>
                        <p className="text-sm">₹{holding.value.toLocaleString()}</p>
                        <p className={cn('text-xs', pnl >= 0 ? 'text-green-500' : 'text-red-500')}>
                            {pnl >= 0 ? '+' : ''}{pnlPercent.toFixed(2)}%
                        </p>
                    </div>
                );
            })}
        </div>
    );
};


const FuturesAccordion = ({ positions, marketData }: { positions: any[], marketData: CryptoCurrency[] }) => {
    const { sell } = usePortfolioStore();
    const { user } = useUser();
    const firestore = useFirestore();

    if (positions.length === 0) {
        return (
            <div className="flex items-center justify-center h-24 rounded-lg bg-secondary/50">
                <p className="text-muted-foreground">You have no futures positions.</p>
            </div>
        );
    }
    
    const getAssetPath = (item: { assetType?: string, id: string }) => {
        return `/trade/futures/${item.id.replace('-fut', '')}`;
    }
    
    const handleSquareOff = (position: any) => {
        if (!user || !firestore) return;

        // For selling a short, we "buy" back. For selling a long, we "sell".
        // The `sell` function in the store handles both by reducing the holding amount.
        // We pass the absolute amount to close the position.
        sell(user, firestore, position.crypto, Math.abs(position.amount));
    }


    return (
        <Accordion type="single" collapsible className="w-full">
            {positions.map((holding) => {
                const isShort = holding.amount < 0;
                const pnl = (holding.baseAssetPrice - holding.entryPrice) * holding.amount;
                const pnlPercent = holding.margin > 0 ? (pnl / holding.margin) * 100 : 0;
                
                return (
                    <AccordionItem value={holding.crypto.id} key={holding.crypto.id}>
                        <AccordionTrigger>
                            <div className="flex items-center gap-3 w-full">
                                <div>
                                    <div className="font-semibold flex items-center gap-2">
                                        {holding.crypto.name.replace('Futures', '')}
                                        <Badge variant={isShort ? "destructive" : "default"} className={isShort ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-500'}>
                                            {isShort ? 'SHORT' : 'LONG'}
                                        </Badge>
                                    </div>
                                    <div className="text-xs text-muted-foreground">{holding.crypto.symbol} ({holding.leverage}x)</div>
                                </div>
                                <div className="ml-auto text-right">
                                    <div className="font-mono font-semibold">
                                       ₹{(holding.margin ?? 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </div>
                                     <div className={cn("text-sm flex items-center justify-end gap-1", pnl >= 0 ? "text-green-500" : "text-red-500")}>
                                        {pnl >= 0 ? <ArrowUp className="h-3 w-3"/> : <ArrowDown className="h-3 w-3"/>}
                                        <span>{pnl.toFixed(2)} ({pnlPercent.toFixed(2)}%)</span>
                                    </div>
                                </div>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className="p-2 bg-muted/50 rounded-md">
                                <div className="grid grid-cols-3 gap-4 text-sm mb-4">
                                    <div>
                                        <p className="text-muted-foreground">Quantity</p>
                                        <p className="font-semibold">{Math.abs(holding.amount).toFixed(4)}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-muted-foreground">Entry Price</p>
                                        <p className="font-semibold">₹{holding.entryPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-muted-foreground">Current Price</p>
                                        <p className="font-semibold">₹{holding.baseAssetPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                    </div>
                                </div>
                                {(holding.stopLoss || holding.takeProfit || holding.trailingStopLoss) && (
                                    <div className="grid grid-cols-2 gap-4 pt-2 mt-2 border-t text-sm mb-4">
                                        <div>
                                            <p className="text-muted-foreground">Stop Loss</p>
                                            <p className="font-semibold text-red-500">{holding.stopLoss ? `₹${holding.stopLoss}` : 'Not Set'}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-muted-foreground">Take Profit</p>
                                            <p className="font-semibold text-green-500">{holding.takeProfit ? `₹${holding.takeProfit}` : 'Not Set'}</p>
                                        </div>
                                        {holding.trailingStopLoss && (
                                          <div>
                                              <p className="text-muted-foreground">Trailing SL</p>
                                              <p className="font-semibold text-orange-500">{holding.trailingStopLoss.percentage}%</p>
                                          </div>
                                        )}
                                    </div>
                                )}
                                <div className="flex gap-2 mt-4">
                                    <Link href={`${getAssetPath(holding.crypto)}?modify=true`} passHref className="w-full">
                                        <Button size="sm" variant="outline" className="w-full">Modify</Button>
                                    </Link>
                                    <Button size="sm" variant="destructive" className="w-full" onClick={() => handleSquareOff(holding)}>Square Off</Button>
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                )
            })}
        </Accordion>
    );
};


export function CryptoPositions({ portfolio, marketData }: CryptoPositionsProps) {
    const [holdingsView, setHoldingsView] = React.useState('list');
    const [positionsView, setPositionsView] = React.useState('list');

    const holdingsWithValue = portfolio.holdings
        .map(holding => {
            const crypto = marketData.find(c => c.id === holding.cryptoId);
            if (!crypto || holding.assetType === 'Futures') return null;
            if (!holding.margin) return null;
            
            const value = holding.amount * crypto.price;
            return { ...holding, crypto, value };
        })
        .filter((holding): holding is NonNullable<typeof holding> => holding !== null)
        .sort((a, b) => b.value - a.value);

    const futuresPositions = portfolio.holdings
        .map(holding => {
            if (holding.assetType !== 'Futures') return null;
            const crypto = marketData.find(c => c.id === holding.cryptoId);
            const baseAsset = marketData.find(c => c.id === holding.cryptoId.replace('-fut', ''));
            if (!crypto || !baseAsset || !holding.margin || holding.amount === 0) return null;

            const leverage = Math.round(Math.abs((holding.amount * baseAsset.price) / holding.margin));
            const entryPrice = isNaN(leverage) || leverage === 0 ? baseAsset.price : Math.abs((holding.margin * leverage) / holding.amount);
            const value = holding.margin; // For charting purposes, we can use margin

            return { ...holding, crypto, leverage: isNaN(leverage) ? 0 : leverage, baseAssetPrice: baseAsset.price, entryPrice: isNaN(entryPrice) ? 0 : entryPrice, value };
        })
        .filter((holding): holding is NonNullable<typeof holding> => holding !== null);

    const renderView = (view: string, data: any[], type: 'holdings' | 'positions') => {
        switch (view) {
            case 'bar':
                return <HoldingsBarChart holdings={data} />;
            case 'pie':
                return <HoldingsPieChart holdings={data} />;
            case 'heatmap':
                return <HoldingsHeatmap holdings={data} />;
            case 'list':
            default:
                return type === 'holdings' 
                    ? <HoldingsAccordion holdings={data} /> 
                    : <FuturesAccordion positions={data} marketData={marketData} />;
        }
    };
    
    const ViewSwitcher = ({ view, setView }: { view: string, setView: (v: string) => void }) => (
        <div className="flex gap-1">
            <Button variant={view === 'list' ? 'secondary' : 'ghost'} size="icon" onClick={() => setView('list')}><List className="h-4 w-4" /></Button>
            <Button variant={view === 'bar' ? 'secondary' : 'ghost'} size="icon" onClick={() => setView('bar')}><BarChart className="h-4 w-4" /></Button>
            <Button variant={view === 'pie' ? 'secondary' : 'ghost'} size="icon" onClick={() => setView('pie')}><PieChart className="h-4 w-4" /></Button>
            <Button variant={view === 'heatmap' ? 'secondary' : 'ghost'} size="icon" onClick={() => setView('heatmap')}><Grid className="h-4 w-4" /></Button>
        </div>
    );

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                <div className="flex flex-row items-center justify-between p-6">
                    <div className="flex items-center gap-3">
                        <h3 className="text-2xl font-semibold leading-none tracking-tight">Holdings</h3>
                    </div>
                    <ViewSwitcher view={holdingsView} setView={setHoldingsView} />
                </div>
                <div className="px-6 pb-6">
                    {renderView(holdingsView, holdingsWithValue, 'holdings')}
                </div>
            </div>
            
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                <div className="flex flex-row items-center justify-between p-6">
                    <div className="flex items-center gap-3">
                        <h3 className="text-2xl font-semibold leading-none tracking-tight">Futures Positions</h3>
                    </div>
                    <ViewSwitcher view={positionsView} setView={setPositionsView} />
                </div>
                <div className="px-6 pb-6">
                   {renderView(positionsView, futuresPositions, 'positions')}
                </div>
            </div>
        </div>
    );
}
