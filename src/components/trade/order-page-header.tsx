
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BarChart, Star } from 'lucide-react';
import { CryptoCurrency } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface OrderPageHeaderProps {
  crypto?: CryptoCurrency;
  loading?: boolean;
}

export function OrderPageHeader({ crypto, loading }: OrderPageHeaderProps) {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-6 w-6" />
          </Button>
          
          <div className="flex flex-col items-center">
            {loading ? (
                <>
                    <Skeleton className="h-6 w-24 mb-1" />
                    <Skeleton className="h-4 w-32" />
                </>
            ) : crypto ? (
                <>
                    <h1 className="text-lg font-semibold">{crypto.name}</h1>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>${crypto.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: crypto.price < 1 ? 6 : 2 })}</span>
                        <span className={cn(crypto.change24h >= 0 ? 'text-green-500' : 'text-red-500')}>
                            ({crypto.change24h.toFixed(2)}%)
                        </span>
                    </div>
                </>
            ) : (
                <h1 className="text-lg font-semibold">Not Found</h1>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
                <Star className="h-6 w-6" />
            </Button>
            <Button variant="ghost" size="icon">
                <BarChart className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
