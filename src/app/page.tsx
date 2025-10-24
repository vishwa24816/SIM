"use client";

import * as React from "react";
import { Header } from "@/components/dashboard/header";
import { MarketTable } from "@/components/dashboard/market-table";
import { NewsFeed } from "@/components/dashboard/news-feed";
import { PortfolioView } from "@/components/dashboard/portfolio-view";
import { useMarketData } from "@/hooks/use-market-data";
import { usePortfolio } from "@/hooks/use-portfolio";
import { CryptoCurrency } from "@/lib/types";
import { Home, ListOrdered, ScreenShare, Bitcoin, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { marketData, setSelectedCryptoId, loading } = useMarketData();
  const { portfolio, totalPortfolioValue } = usePortfolio(marketData);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6">
        <div className="pt-6">
          <div className="grid grid-cols-1 gap-6 max-w-screen-2xl mx-auto">
            <PortfolioView
              portfolio={portfolio}
              marketData={marketData}
              totalPortfolioValue={totalPortfolioValue}
            />
            <MarketTable
              cryptos={marketData}
              onRowClick={(crypto: CryptoCurrency) => setSelectedCryptoId(crypto.id)}
            />
            <NewsFeed />
          </div>
        </div>
      </main>
      <footer className="sticky bottom-0 z-50 mt-auto bg-card/90 backdrop-blur-sm border-t">
        <nav className="flex justify-around items-center h-16 px-4">
          <Button variant="ghost" className="flex flex-col h-auto items-center text-primary">
            <Home className="h-6 w-6" />
            <span className="text-xs">Home</span>
          </Button>
          <Button variant="ghost" className="flex flex-col h-auto items-center text-muted-foreground">
            <ListOrdered className="h-6 w-6" />
            <span className="text-xs">Orders</span>
          </Button>
          <Button variant="ghost" className="flex flex-col h-auto items-center text-muted-foreground">
            <Bitcoin className="h-6 w-6" />
            <span className="text-xs">Crypto</span>
          </Button>
          <Button variant="ghost" className="flex flex-col h-auto items-center text-muted-foreground">
            <Globe className="h-6 w-6" />
            <span className="text-xs">Web3</span>
          </Button>
          <Button variant="ghost" className="flex flex-col h-auto items-center text-muted-foreground">
            <ScreenShare className="h-6 w-6" />
            <span className="text-xs">Screener</span>
          </Button>
        </nav>
      </footer>
    </div>
  );
}
