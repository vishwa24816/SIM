
"use client";

import * as React from "react";
import { Header } from "@/components/dashboard/header";
import { MarketTable } from "@/components/dashboard/market-table";
import { NewsFeed } from "@/components/dashboard/news-feed";
import { PortfolioView } from "@/components/dashboard/portfolio-view";
import { useMarketData } from "@/hooks/use-market-data";
import { usePortfolio } from "@/hooks/use-portfolio";
import { CryptoCurrency } from "@/lib/types";
import { BottomNav } from "@/components/dashboard/bottom-nav";
import { CryptoPositions } from "@/components/dashboard/crypto-positions";

export default function DashboardPage() {
  const { marketData, setSelectedCryptoId, loading } = useMarketData();
  const { portfolio, totalPortfolioValue, addUsd, withdrawUsd } = usePortfolio(marketData);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6">
        <PortfolioView
          portfolio={portfolio}
          marketData={marketData}
          totalPortfolioValue={totalPortfolioValue}
          addUsd={addUsd}
          withdrawUsd={withdrawUsd}
        />
        <MarketTable
          cryptos={marketData}
          onRowClick={(crypto: CryptoCurrency) => setSelectedCryptoId(crypto.id)}
        />
        <CryptoPositions portfolio={portfolio} marketData={marketData} />
        <NewsFeed />
      </main>
      <BottomNav />
    </div>
  );
}
