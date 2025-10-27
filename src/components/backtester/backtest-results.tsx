'use client';

import { Area, AreaChart, Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { BacktestResult } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { TrendingUp } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../ui/chart';

interface BacktestResultsProps {
  results: BacktestResult;
}

export function BacktestResults({ results }: BacktestResultsProps) {
  const { netPnl, netPnlPercentage, totalTrades, winRate, portfolioHistory, trades } = results;

  const chartConfig = {
    value: {
      label: 'Portfolio Value',
      color: 'hsl(var(--primary))',
    },
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-6 h-6 text-primary" />
            <CardTitle>Backtest Results</CardTitle>
          </div>
          <CardDescription>Performance based on the provided strategy.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">Net P&L</p>
            <p className={cn('text-lg font-bold', netPnl >= 0 ? 'text-green-500' : 'text-red-500')}>
              {netPnl.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
            </p>
            <p className={cn('text-xs', netPnl >= 0 ? 'text-green-500' : 'text-red-500')}>
              ({netPnlPercentage.toFixed(2)}%)
            </p>
          </div>
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">Total Trades</p>
            <p className="text-lg font-bold">{totalTrades}</p>
          </div>
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">Win Rate</p>
            <p className="text-lg font-bold">{winRate.toFixed(2)}%</p>
          </div>
           <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">Final Value</p>
            <p className="text-lg font-bold">
                {(100000 + netPnl).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Portfolio Value Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
             <ChartContainer config={chartConfig} className="h-full w-full">
                 <AreaChart data={portfolioHistory} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                     <XAxis 
                        dataKey="time" 
                        tickFormatter={(val) => new Date(val).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })}
                        tickLine={false}
                        axisLine={false}
                        dy={10}
                     />
                    <YAxis 
                        tickFormatter={(val) => `$${(val as number / 1000)}k`}
                        allowDecimals={false}
                        tickLine={false}
                        axisLine={false}
                        dx={-10}
                    />
                    <Tooltip content={<ChartTooltipContent indicator="dot" />} />
                    <defs>
                        <linearGradient id="fillValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--color-value)" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="var(--color-value)" stopOpacity={0.1}/>
                        </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="value" stroke="var(--color-value)" fill="url(#fillValue)" strokeWidth={2} />
                </AreaChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Trade History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Asset</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead className="text-right">P&L</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trades.map((trade, index) => (
                  <TableRow key={index}>
                    <TableCell>{new Date(trade.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          'px-2 py-1 rounded-full text-xs font-semibold',
                          trade.type === 'BUY' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
                        )}
                      >
                        {trade.type}
                      </span>
                    </TableCell>
                    <TableCell>{trade.asset}</TableCell>
                    <TableCell>{trade.price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</TableCell>
                    <TableCell>{trade.quantity}</TableCell>
                    <TableCell className={cn('text-right', trade.pnl > 0 ? 'text-green-500' : trade.pnl < 0 ? 'text-red-500' : '')}>
                      {trade.pnl.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
