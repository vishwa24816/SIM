
"use client";

import * as React from "react";
import { Header } from "@/components/dashboard/header";
import { NewsFeed } from "@/components/dashboard/news-feed";
import { PortfolioView } from "@/components/dashboard/portfolio-view";
import { useMarketData } from "@/hooks/use-market-data";
import { usePortfolioStore } from "@/hooks/use-portfolio";
import { CryptoCurrency } from "@/lib/types";
import { BottomNav } from "@/components/dashboard/bottom-nav";
import { CryptoPositions } from "@/components/dashboard/crypto-positions";
import { useRouter } from "next/navigation";
import { useUser } from "@/firebase";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const { marketData, loading: marketLoading } = useMarketData();
  const { portfolio, addUsd, withdrawUsd, getPortfolioValue } = usePortfolioStore();
  const router = useRouter();

  React.useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || marketLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  const handleCryptoSelect = (crypto: CryptoCurrency) => {
    router.push(`/crypto/${crypto.id}`);
  };

  const totalPortfolioValue = getPortfolioValue(marketData);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6 pb-20">
        <PortfolioView
          portfolio={portfolio}
          marketData={marketData}
          totalPortfolioValue={totalPortfolioValue}
          addUsd={addUsd}
          withdrawUsd={withdrawUsd}
        />
        
        <CryptoPositions portfolio={portfolio} marketData={marketData} />

        <NewsFeed />
      </main>
      <BottomNav />
    </div>
  );
}
