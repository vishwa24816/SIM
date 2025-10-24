'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, ListOrdered, Bitcoin, Globe, ScreenShare } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/orders', icon: ListOrdered, label: 'Orders' },
    { href: '/crypto', icon: Bitcoin, label: 'Trade' },
    { href: '#', icon: Globe, label: 'Web3' },
    { href: '#', icon: ScreenShare, label: 'Screener' },
  ];

  return (
    <footer className="sticky bottom-0 z-50 mt-auto bg-card/90 backdrop-blur-sm border-t">
      <nav className="flex justify-around items-center h-16 px-4">
        {navItems.map((item) => {
            const isActive = pathname === item.href;
            const isButton = item.href === '#';

            if (isButton) {
                return (
                    <Button
                        key={item.label}
                        variant="ghost"
                        className="flex flex-col h-auto items-center text-muted-foreground"
                    >
                        <item.icon className="h-6 w-6" />
                        <span className="text-xs">{item.label}</span>
                    </Button>
                )
            }
            
            return (
              <Link key={item.label} href={item.href} legacyBehavior passHref>
                <Button
                  variant="ghost"
                  className={cn(
                    'flex flex-col h-auto items-center',
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  )}
                >
                  <item.icon className="h-6 w-6" />
                  <span className="text-xs">{item.label}</span>
                </Button>
              </Link>
            )
        })}
      </nav>
    </footer>
  );
}
