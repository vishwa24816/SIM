
"use client";

import * as React from 'react';
import { Menu, Search, User, Home, Info, BarChart2, Cpu, History, Rocket, FileText, LifeBuoy, X, LogOut, Sun, Moon, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTrigger, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Logo } from "@/components/icons/logo";
import { Separator } from '../ui/separator';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useMarketData } from '@/hooks/use-market-data';
import { CryptoCurrency } from '@/lib/types';
import { Card, CardContent } from '../ui/card';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import placeholderImages from '@/app/lib/placeholder-images.json';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { setTheme, theme } = useTheme();
  const router = useRouter();
  const auth = useAuth();
  
  const [searchTerm, setSearchTerm] = React.useState('');
  const [searchResults, setSearchResults] = React.useState<CryptoCurrency[]>([]);
  const [isSearchFocused, setIsSearchFocused] = React.useState(false);
  const { marketData } = useMarketData();
  const searchWrapperRef = React.useRef<HTMLDivElement>(null);


  const handleNavigation = (path: string) => {
    setIsMenuOpen(false);
    setSearchTerm('');
    setSearchResults([]);
    router.push(path);
  };
  
  const handleCryptoSelect = (path: string) => {
    setSearchTerm('');
    setSearchResults([]);
    setIsMenuOpen(false);
    router.push(path);
  }


  const handleLogout = async () => {
    setIsMenuOpen(false);
    if (auth) {
      await signOut(auth);
    }
    router.push('/login');
  };

  React.useEffect(() => {
    if (searchTerm) {
      const filtered = marketData.filter(crypto =>
        crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 10); // Limit to top 10 results for performance
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  }, [searchTerm, marketData]);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-primary/95 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 gap-4">
                <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-primary-foreground/70 hover:text-primary-foreground">
                            <Menu className="h-6 w-6" />
                            <span className="sr-only">Open menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-72 bg-card p-0 flex flex-col">
                        <SheetHeader className="p-4 border-b">
                            <div className="flex items-center gap-3">
                                <Image
                                  src={placeholderImages.logo.src}
                                  alt={placeholderImages.logo.alt}
                                  width={32}
                                  height={32}
                                  className="rounded-md"
                                  data-ai-hint={placeholderImages.logo['data-ai-hint']}
                                />
                                <h2 className="text-xl font-bold">SIM</h2>
                            </div>
                            <SheetTitle className="sr-only">Menu</SheetTitle>
                        </SheetHeader>
                        <div className="p-4 flex-1 overflow-y-auto">
                            <nav className="flex flex-col gap-1">
                                <Button onClick={() => handleNavigation('/')} variant="ghost" className="justify-start gap-3"><Home /> Home</Button>
                                <Link href="https://simblog.vercel.app" target="_blank" rel="noopener noreferrer">
                                    <Button variant="ghost" className="w-full justify-start gap-3"><Info /> About</Button>
                                </Link>
                                <Button onClick={() => handleNavigation('/analytics')} variant="ghost" className="justify-start gap-3"><BarChart2 /> Analytics</Button>
                                <Button onClick={() => handleNavigation('/backtester')} variant="ghost" className="justify-start gap-3"><History /> Backtester</Button>
                                <Button onClick={() => handleNavigation('/nocode-algo')} variant="ghost" className="justify-start gap-3"><Cpu /> No-code Algo</Button>
                                <Button onClick={() => handleNavigation('/leaderboard')} variant="ghost" className="justify-start gap-3"><Trophy /> Leaderboard</Button>
                                <Separator className="my-2" />
                                <Button onClick={() => handleNavigation('/simball')} variant="ghost" className="justify-start gap-3"><Rocket /> SIMBALL</Button>
                                <Button onClick={() => handleNavigation('/taxy')} variant="ghost" className="justify-start gap-3"><FileText /> TAXY</Button>
                                <Separator className="my-2" />
                                <Button onClick={() => handleNavigation('/support')} variant="ghost" className="justify-start gap-3"><LifeBuoy /> Support</Button>
                            </nav>
                        </div>
                        <SheetFooter className="p-4 border-t mt-auto">
                           <div className="flex items-center justify-between w-full">
                                <Button variant="ghost" className="justify-start gap-3" onClick={handleLogout}>
                                    <LogOut /> Log Out
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
                                    <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                                    <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                                    <span className="sr-only">Toggle theme</span>
                                </Button>
                           </div>
                        </SheetFooter>
                    </SheetContent>
                </Sheet>
                <div className="flex-grow relative" ref={searchWrapperRef}>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary-foreground/50" />
                        <Input
                            type="search"
                            placeholder="Search assets..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/50 border-none focus:ring-2 focus:ring-primary-foreground"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onFocus={() => setIsSearchFocused(true)}
                        />
                    </div>
                     {isSearchFocused && searchResults.length > 0 && (
                        <Card className="absolute top-full mt-2 w-full z-50 max-h-80 overflow-y-auto">
                            <CardContent className="p-2">
                                {searchResults.map(crypto => {
                                    const Icon = crypto.icon;
                                    const path = `/crypto/${crypto.id}`;
                                    
                                    return (
                                        <div 
                                            key={crypto.id} 
                                            className="flex items-center gap-3 p-2 rounded-md hover:bg-muted cursor-pointer"
                                            onClick={() => handleCryptoSelect(path)}
                                        >
                                            <Icon className="w-6 h-6"/>
                                            <div>
                                                <p className="font-semibold">{crypto.name}</p>
                                                <p className="text-xs text-muted-foreground">{crypto.symbol}</p>
                                            </div>
                                             <div className="ml-auto text-right">
                                                <p className="font-mono text-sm">${crypto.price.toLocaleString()}</p>
                                                <p className={cn("text-xs", crypto.change24h >= 0 ? "text-green-500" : "text-red-500")}>
                                                    {crypto.change24h.toFixed(2)}%
                                                </p>
                                            </div>
                                        </div>
                                    )
                                })}
                            </CardContent>
                        </Card>
                    )}
                </div>
                <Link href="/profile" passHref>
                    <Button variant="ghost" size="icon" className="text-primary-foreground/70 hover:text-primary-foreground">
                        <User className="h-6 w-6" />
                        <span className="sr-only">Open profile</span>
                    </Button>
                </Link>
            </div>
        </div>
    </header>
  );
}
