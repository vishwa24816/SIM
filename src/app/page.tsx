"use client";

import * as React from "react";
import { Header } from "@/components/dashboard/header";
import { MarketTable } from "@/components/dashboard/market-table";
import { NewsFeed } from "@/components/dashboard/news-feed";
import { PortfolioView } from "@/components/dashboard/portfolio-view";
import { PriceChart } from "@/components/dashboard/price-chart";
import { TradingPanel } from "@/components/dashboard/trading-panel";
import { useMarketData } from "@/hooks/use-market-data";
import { usePortfolio } from "@/hooks/use-portfolio";
import { CryptoSelector } from "@/components/dashboard/crypto-selector";
import { CryptoCurrency } from "@/lib/types";

export default function DashboardPage() {
  const { marketData, selectedCrypto, setSelectedCryptoId, loading } = useMarketData();
  const { portfolio, buy, sell, totalPortfolioValue } = usePortfolio(marketData);

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <Header />
      <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-screen-2xl mx-auto">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
               <CryptoSelector 
                cryptos={marketData}
                selectedCryptoId={selectedCrypto.id}
                onValueChange={setSelectedCryptoId}
              />
            </div>
            <PriceChart crypto={selectedCrypto} loading={loading} />
            <MarketTable cryptos={marketData} onRowClick={(crypto: CryptoCurrency) => setSelectedCryptoId(crypto.id)} />
          </div>
          <div className="flex flex-col gap-6">
            <TradingPanel
              selectedCrypto={selectedCrypto}
              portfolio={portfolio}
              onBuy={buy}
              onSell={sell}
            />
            <PortfolioView
              portfolio={portfolio}
              marketData={marketData}
              totalPortfolioValue={totalPortfolioValue}
            />
            <NewsFeed />
          </div>
        </div>
      </main>
    </div>
  );
}
