
'use client';

import * as React from 'react';
import Link from 'next/link';
import { Home, ListOrdered, Bitcoin, TrendingUp, AreaChart } from 'lucide-react';
import { usePathname, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';

export function BottomNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/orders', label: 'Orders', icon: ListOrdered },
    { href: '/crypto', label: 'Trade', icon: Bitcoin },
    { href: '/crypto?type=Futures', label: 'Futures', icon: TrendingUp },
    { href: '/screener', label: 'Screener', icon: AreaChart },
  ];

  return (
    <footer className="sticky bottom-0 z-50 bg-card/90 backdrop-blur-sm border-t">
      <nav className="flex justify-around items-center h-16 px-4">
        {navItems.map((item) => {
            const tradeType = searchParams.get('type');
            const isFuturesActive = item.href.includes('?type=Futures') && pathname === '/crypto' && tradeType === 'Futures';
            const isTradeActive = item.label === 'Trade' && (pathname.startsWith('/trade') || (pathname === '/crypto' && !tradeType));
            const isRegularActive = pathname === item.href;
            
            const isActive = isRegularActive || isTradeActive || isFuturesActive;
            
            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  'flex flex-col h-auto items-center justify-center text-sm gap-1 pt-2 w-16',
                  isActive ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                <item.icon className="h-6 w-6" />
                <span className="truncate">{item.label}</span>
              </Link>
            )
        })}
      </nav>
    </footer>
  );
}
