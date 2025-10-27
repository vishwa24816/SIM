
"use client";

import * as React from 'react';
import { Menu, Search, User, Home, Info, BarChart2, Cpu, History, Rocket, FileText, LifeBuoy, X, LogOut, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTrigger, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Logo } from "@/components/icons/logo";
import { Separator } from '../ui/separator';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { setTheme, theme } = useTheme();
  const router = useRouter();

  const handleNavigation = (path: string) => {
    setIsMenuOpen(false);
    router.push(path);
  };

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
                                <Logo className="h-8 w-8 text-primary" />
                                <h2 className="text-xl font-bold">SIM</h2>
                            </div>
                            <SheetTitle className="sr-only">Menu</SheetTitle>
                        </SheetHeader>
                        <div className="p-4 flex-1 overflow-y-auto">
                            <nav className="flex flex-col gap-1">
                                <Button onClick={() => handleNavigation('/')} variant="ghost" className="justify-start gap-3"><Home /> Home</Button>
                                <Button onClick={() => handleNavigation('#')} variant="ghost" className="justify-start gap-3"><Info /> About</Button>
                                <Button onClick={() => handleNavigation('/analytics')} variant="ghost" className="justify-start gap-3"><BarChart2 /> Analytics</Button>
                                <Button onClick={() => handleNavigation('/backtester')} variant="ghost" className="justify-start gap-3"><History /> Backtester</Button>
                                <Separator className="my-2" />
                                <Button onClick={() => handleNavigation('/simball')} variant="ghost" className="justify-start gap-3"><Rocket /> SIMBALL</Button>
                                <Button onClick={() => handleNavigation('/taxy')} variant="ghost" className="justify-start gap-3"><FileText /> TAXY</Button>
                                <Separator className="my-2" />
                                <Button onClick={() => handleNavigation('/support')} variant="ghost" className="justify-start gap-3"><LifeBuoy /> Support</Button>
                            </nav>
                        </div>
                        <SheetFooter className="p-4 border-t mt-auto">
                           <div className="flex items-center justify-between w-full">
                                <Button variant="ghost" className="justify-start gap-3">
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
                <div className="flex-grow">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary-foreground/50" />
                        <Input
                            type="search"
                            placeholder="Search in all portfolios..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/50 border-none focus:ring-2 focus:ring-primary-foreground"
                        />
                    </div>
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
