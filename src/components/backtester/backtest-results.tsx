'use client';

import { BacktestResult } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { TrendingUp } from 'lucide-react';

interface BacktestResultsProps {
  results: BacktestResult;
}

const StatCard = ({ title, value, valueClass }: { title: string, value: string, valueClass?: string }) => (
    <div className="p-4 bg-muted/50 rounded-lg text-center">
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className={cn('text-xl font-bold', valueClass)}>{value}</p>
    </div>
);


export function BacktestResults({ results }: BacktestResultsProps) {
  const { netPnl, winRate, trades, maxDrawdown, sharpeRatio } = results;

  const formatInr = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(value);
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-6 h-6 text-primary" />
            <CardTitle>Backtest Results</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <StatCard 
                    title="Total P&L"
                    value={formatInr(netPnl)}
                    valueClass={netPnl >= 0 ? 'text-green-500' : 'text-red-500'}
                />
                <StatCard 
                    title="Win Rate"
                    value={`${winRate.toFixed(1)}%`}
                />
                 <StatCard 
                    title="Max Drawdown"
                    value={`${maxDrawdown.toFixed(1)}%`}
                />
                 <StatCard 
                    title="Sharpe Ratio"
                    value={sharpeRatio.toFixed(1)}
                />
            </div>

            <div>
                <h4 className="font-semibold mb-2">Trades Executed</h4>
                <div className="overflow-x-auto border rounded-lg">
                    <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead>Type</TableHead>
                            <TableHead>Symbol</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead className="text-right">Price</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {trades.map((trade, index) => (
                            <TableRow key={index}>
                                <TableCell>
                                <span
                                    className={cn(
                                    'font-semibold',
                                    trade.type === 'BUY' ? 'text-green-500' : 'text-red-500'
                                    )}
                                >
                                    {trade.type}
                                </span>
                                </TableCell>
                                <TableCell>{trade.asset}</TableCell>
                                <TableCell>{trade.quantity}</TableCell>
                                <TableCell className="text-right">{formatInr(trade.price)}</TableCell>
                            </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
