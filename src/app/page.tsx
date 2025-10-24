"use client";

import * as React from "react";
import { Header } from "@/components/dashboard/header";
import { MarketTable } from "@/components/dashboard/market-table";
import { NewsFeed } from "@/components/dashboard/news-feed";
import { PortfolioView } from "@/components/dashboard/portfolio-view";
import { useMarketData } from "@/hooks/use-market-data";
import { usePortfolio } from "@/hooks/use-portfolio";
import { CryptoCurrency } from "@/lib/types";
import { Home, ListOrdered, Bot, ScreenShare, Users } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { marketData, setSelectedCryptoId } = useMarketData();
  const { portfolio, totalPortfolioValue } = usePortfolio(marketData);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6">
        <Tabs defaultValue="holdings">
          <div className="overflow-x-auto">
            <TabsList className="bg-transparent p-0 border-b border-border rounded-none">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="flat">Flat</TabsTrigger>
              <TabsTrigger value="crypto">Crypto</TabsTrigger>
              <TabsTrigger value="exchange">Exchange</TabsTrigger>
              <TabsTrigger value="holdings">Holdings</TabsTrigger>
              <TabsTrigger value="positions">Positions</TabsTrigger>
              <TabsTrigger value="watchlist">Portfolio Watchlist</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="holdings" className="pt-6">
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
          </TabsContent>
        </Tabs>
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
            <Bot className="h-6 w-6" />
            <span className="text-xs">Simbot</span>
          </Button>
          <Button variant="ghost" className="flex flex-col h-auto items-center text-muted-foreground">
            <ScreenShare className="h-6 w-6" />
            <span className="text-xs">Screener</span>
          </Button>
           <Button variant="ghost" className="flex flex-col h-auto items-center text-muted-foreground">
            <Users className="h-6 w-6" />
            <span className="text-xs">Community</span>
          </Button>
        </nav>
      </footer>
    </div>
  );
}
