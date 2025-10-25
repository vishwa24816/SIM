
'use client';

import * as React from 'react';
import { Bot } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { CryptoCurrency } from '@/lib/types';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';


interface SimbotAnalysisProps {
    crypto: CryptoCurrency;
}
export function SimbotAnalysis({ crypto }: SimbotAnalysisProps) {
  return (
    <div>
        <div className="flex flex-col space-y-1.5 p-6">
            <div className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                <h3 className="text-lg font-semibold leading-none tracking-tight">Simbot Overview</h3>
            </div>
        </div>
        <div className="p-6 pt-0">
            <div className="flex gap-3">
                <Avatar>
                    <AvatarFallback>B</AvatarFallback>
                </Avatar>
                <div className="p-3 bg-muted rounded-lg text-sm">
                    <p>Based on recent trends, {crypto.name} ({crypto.symbol}) is showing strong bullish momentum. Key indicators suggest a potential breakout above the ${crypto.price.toFixed(4)} level in the short term.</p>
                </div>
            </div>
        </div>
    </div>
  );
}
