
"use client";

import * as React from "react";
import { Header } from "@/components/dashboard/header";
import { NewsFeed } from "@/components/dashboard/news-feed";
import { PortfolioView } from "@/components/dashboard/portfolio-view";
import { useMarketData } from "@/hooks/use-market-data";
import { usePortfolioStore } from "@/hooks/use-portfolio";
import { CryptoCurrency, Holding, UserProfile } from "@/lib/types";
import { BottomNav } from "@/components/dashboard/bottom-nav";
import { CryptoPositions } from "@/components/dashboard/crypto-positions";
import { useRouter } from "next/navigation";
import { useUser, useCollection, useMemoFirebase, useFirestore } from "@/firebase";
import { Loader2 } from "lucide-react";
import { collection } from "firebase/firestore";
import { useUserProfile } from "@/hooks/use-user-profile";

export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const { marketData, loading: marketLoading } = useMarketData();
  const { portfolio, setPortfolio, getPortfolioValue } = usePortfolioStore();
  const router = useRouter();

  const { profile, loading: isProfileLoading } = useUserProfile();

  const holdingsCollectionRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return collection(firestore, 'users', user.uid, 'holdings');
  }, [firestore, user]);

  const { data: holdings, isLoading: isHoldingsLoading } = useCollection<Holding>(holdingsCollectionRef);

  React.useEffect(() => {
    if (profile) {
      setPortfolio({ ...portfolio, usdBalance: profile.usdBalance });
    }
  }, [profile, setPortfolio]);

  React.useEffect(() => {
    if (holdings) {
      setPortfolio({ ...portfolio, holdings });
    }
  }, [holdings, setPortfolio]);


  React.useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || marketLoading || isHoldingsLoading || isProfileLoading) {
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
        />
        
        <CryptoPositions portfolio={portfolio} marketData={marketData} />

        <NewsFeed />
      </main>
      <BottomNav />
    </div>
  );
}
