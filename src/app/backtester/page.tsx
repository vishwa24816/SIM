'use client';

import * as React from 'react';
import { ArrowLeft, Bot, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useRouter } from 'next/navigation';

export default function BacktesterPage() {
  const router = useRouter();
  const [strategy, setStrategy] = React.useState('WHEN SMA(50) crosses below\nSMA(200)\nSELL ALL');

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

      <main className="p-4 sm:p-6 md:p-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <Bot className="w-6 h-6 text-primary" />
              <CardTitle className="text-lg">AI Strategy Backtester</CardTitle>
            </div>
            <CardDescription>
              Describe a strategy in natural language and let our AI test it for you.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={strategy}
              onChange={(e) => setStrategy(e.target.value)}
              className="min-h-[150px] font-mono text-sm bg-muted/50"
              placeholder="e.g., BUY 1 BTC when its price is below $60000"
            />
            <Button size="lg" className="w-full">
              <Play className="mr-2 h-5 w-5" />
              Run AI Backtest
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
