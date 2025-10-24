
"use client";

import * as React from 'react';
import { Menu, Search, User, Home, Info, BarChart2, Cpu, History, Rocket, FileText, LifeBuoy, X, LogOut, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTrigger, SheetFooter } from "@/components/ui/sheet";
import { Logo } from "@/components/icons/logo";
import { Separator } from '../ui/separator';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

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
                        </SheetHeader>
                        <div className="p-4 flex-1 overflow-y-auto">
                            <nav className="flex flex-col gap-2">
                                <Button variant="ghost" className="justify-start gap-3"><Home /> Home</Button>
                                <Button variant="ghost" className="justify-start gap-3"><Info /> About</Button>
                                <Button variant="ghost" className="justify-start gap-3"><BarChart2 /> Analytics</Button>
                                <Button variant="ghost" className="justify-start gap-3"><Cpu /> No code Algo</Button>
                                <Button variant="ghost" className="justify-start gap-3"><History /> Backtester</Button>
                                <Separator className="my-2" />
                                <Button variant="ghost" className="justify-start gap-3"><Rocket /> SIMBALL</Button>
                                <Button variant="ghost" className="justify-start gap-3"><FileText /> TAXY</Button>
                                <Separator className="my-2" />
                                <Button variant="ghost" className="justify-start gap-3"><LifeBuoy /> Support</Button>
                            </nav>
                        </div>
                        <SheetFooter className="p-4 border-t mt-auto">
                           <div className="flex items-center justify-between w-full">
                                <Button variant="ghost" className="justify-start gap-3">
                                    <LogOut /> Log Out
                                </Button>
                                <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="icon"><Sun className="h-5 w-5" /></Button>
                                    <Button variant="ghost" size="icon"><Moon className="h-5 w-5" /></Button>
                                </div>
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
                <Button variant="ghost" size="icon" className="text-primary-foreground/70 hover:text-primary-foreground">
                    <User className="h-6 w-6" />
                    <span className="sr-only">Open profile</span>
                </Button>
            </div>
        </div>
    </header>
  );
}
