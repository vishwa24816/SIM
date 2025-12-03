
'use client';

import * as React from 'react';
import { ArrowLeft, Bot, Play, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useRouter } from 'next/navigation';
import { BacktestResult } from '@/lib/types';
import { BacktestResults } from '@/components/backtester/backtest-results';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';

const DUMMY_RESULTS: BacktestResult = {
  netPnl: 1250.8,
  netPnlPercentage: 1.25,
  totalTrades: 2,
  winRate: 100,
  maxDrawdown: 0.5,
  sharpeRatio: 1.5,
  trades: [
    { date: '2024-06-10', type: 'BUY', asset: 'BTC', price: 64500.0, quantity: 1, pnl: 0 },
    { date: '2024-06-18', type: 'SELL', asset: 'BTC', price: 65750.8, quantity: 1, pnl: 1250.8 },
  ],
};

export default function BacktesterPage() {
  const router = useRouter();
  
  const [strategy, setStrategy] = React.useState('WHEN BTC price goes below ₹5,400,000\nBUY 1 BTC\n\nWHEN BTC price goes above ₹5,800,000\nSELL 1 BTC\n\nTest this strategy on the last 1 Month of data.');
  const [isLoading, setIsLoading] = React.useState(false);
  const [results, setResults] = React.useState<BacktestResult | null>(null);

  const handleRunBacktest = async () => {
    setIsLoading(true);
    setResults(null);
    // Simulate a network request to the AI
    setTimeout(() => {
        setResults(DUMMY_RESULTS);
        setIsLoading(false);
    }, 2000);
  };


  return (
    <div className="bg-background min-h-screen">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-xl font-bold">Strategy Backtester</h1>
          </div>
        </div>
      </header>

      <main className="p-4 sm:p-6 md:p-8 space-y-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <Bot className="w-6 h-6 text-primary" />
              <CardTitle className="text-lg">AI Strategy Backtester</CardTitle>
            </div>
            <CardDescription>
              Describe a strategy in natural language, including the timeframe, and let our AI test it against historical Bitcoin data.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="strategy-input">Strategy</Label>
              <Textarea
                id="strategy-input"
                value={strategy}
                onChange={(e) => setStrategy(e.target.value)}
                className="min-h-[150px] font-mono text-sm bg-muted/50"
                placeholder="e.g., BUY 1 BTC when its price is below ₹5,000,000 and test it on the last 7 days of data."
              />
            </div>
            <Button size="lg" className="w-full" onClick={handleRunBacktest} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-5 w-5" />
                  Run AI Backtest
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {(isLoading || results) && <Separator className="max-w-4xl mx-auto" />}

        {isLoading && (
          <div className="text-center text-muted-foreground">Loading results...</div>
        )}
        
        {results && (
          <div className="max-w-4xl mx-auto">
            <BacktestResults results={results} />
          </div>
        )}
      </main>
    </div>
  );
}
