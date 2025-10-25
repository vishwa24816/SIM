
"use client";

import * as React from "react";
import { Header } from "@/components/dashboard/header";
import { NewsFeed } from "@/components/dashboard/news-feed";
import { PortfolioView } from "@/components/dashboard/portfolio-view";
import { useMarketData } from "@/hooks/use-market-data";
import { usePortfolio } from "@/hooks/use-portfolio";
import { CryptoCurrency } from "@/lib/types";
import { BottomNav } from "@/components/dashboard/bottom-nav";
import { CryptoPositions } from "@/components/dashboard/crypto-positions";
import { MarketTable } from "@/components/dashboard/market-table";
import { useRouter } from "next/navigation";
import { Aperture } from "lucide-react";

export default function DashboardPage() {
  const { marketData, setSelectedCryptoId, loading } = useMarketData();
  const { portfolio, totalPortfolioValue, addUsd, withdrawUsd } = usePortfolio(marketData);
  const router = useRouter();

  const handleCryptoSelect = (crypto: CryptoCurrency) => {
    router.push(`/crypto/${crypto.id}`);
  };

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
        
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="flex flex-row items-center justify-between p-6">
            <div className="flex items-center gap-3">
              <Aperture className="w-6 h-6 text-primary" />
              <h3 className="text-2xl font-semibold leading-none tracking-tight">Crypto & Web3 Holdings</h3>
            </div>
          </div>
          <div className="p-6 pt-0">
             <div className="flex items-center justify-center h-24 rounded-lg bg-secondary/50">
                <p className="text-muted-foreground">No data to display.</p>
            </div>
          </div>
        </div>

        <CryptoPositions portfolio={portfolio} marketData={marketData} />

        <NewsFeed />
      </main>
      <BottomNav />
    </div>
  );
}
