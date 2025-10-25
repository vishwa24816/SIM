
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowUp } from 'lucide-react';
import { MutualFund } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Badge } from '../ui/badge';

interface MutualFundPageHeaderProps {
  fund?: MutualFund;
  loading?: boolean;
}

export function MutualFundPageHeader({ fund, loading }: MutualFundPageHeaderProps) {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-6 w-6" />
          </Button>
          
          <div className="flex-1">
            {loading ? (
                <>
                    <Skeleton className="h-6 w-48 mb-2" />
                    <Skeleton className="h-4 w-32" />
                </>
            ) : fund ? (
                <div>
                    <h1 className="text-lg font-semibold leading-tight">{fund.name}</h1>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                       <Badge variant="outline" className="border-red-500 text-red-500">{fund.risk}</Badge>
                       {fund.tags.map(tag => <span key={tag}>• {tag}</span>)}
                    </div>
                </div>
            ) : (
                <h1 className="text-lg font-semibold">Not Found</h1>
            )}
          </div>
        </div>
        
        {fund && !loading && (
             <div className="p-4 bg-background">
                 <div className="flex justify-between items-baseline">
                    <div>
                        <p className={cn("text-2xl font-bold", fund.change3y >= 0 ? 'text-green-500' : 'text-red-500')}>
                            {fund.change3y.toFixed(2)}%
                        </p>
                        <p className="text-sm text-muted-foreground">annual return</p>
                    </div>
                    <div className={cn("flex items-center text-sm", fund.change1d >= 0 ? 'text-green-500' : 'text-red-500')}>
                        <ArrowUp className={cn("h-4 w-4 mr-1", fund.change1d < 0 && "rotate-180")} />
                        {fund.change1d.toFixed(2)}% 1D
                    </div>
                 </div>
            </div>
        )}
      </div>
    </header>
  );
}
