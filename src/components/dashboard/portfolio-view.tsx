import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CryptoCurrency, Portfolio } from "@/lib/types";
import { ArrowUpRight, ArrowDownLeft, History, Bitcoin } from "lucide-react";
import { cn } from "@/lib/utils";

interface PortfolioViewProps {
  portfolio: Portfolio;
  marketData: CryptoCurrency[];
  totalPortfolioValue: number;
}

export function PortfolioView({ portfolio, marketData, totalPortfolioValue }: PortfolioViewProps) {
  const overallPl = totalPortfolioValue - portfolio.usdBalance; // Simple P/L for example
  const overallPlPercent = (overallPl / portfolio.usdBalance) * 100;
  const dayPl = marketData.reduce((acc, crypto) => {
      const holding = portfolio.holdings.find(h => h.cryptoId === crypto.id);
      if (holding) {
          return acc + (holding.amount * (crypto.price * (crypto.change24h / 100)))
      }
      return acc;
  }, 0)
  const dayPlPercent = (dayPl / totalPortfolioValue) * 100;

  return (
    <Card className="bg-card">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/20 rounded-md">
            <Bitcoin className="w-6 h-6 text-blue-400" />
          </div>
          <CardTitle>Trading Wallet</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
                <p className={cn("text-2xl font-bold", overallPl >= 0 ? "text-green-500" : "text-red-500")}>
                    {overallPl.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2 })}
                </p>
                <p className="text-sm text-muted-foreground">Overall P&L ({overallPlPercent.toFixed(2)}%)</p>
            </div>
            <div className="text-right">
                <p className={cn("text-2xl font-bold", dayPl >= 0 ? "text-green-500" : "text-red-500")}>
                    {dayPl.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2 })}
                </p>
                <p className="text-sm text-muted-foreground">Day's P&L ({dayPlPercent.toFixed(2)}%)</p>
            </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm mb-6">
            <div>
                <p className="text-muted-foreground">Total Investment</p>
                <p className="font-semibold">₹{(portfolio.usdBalance).toLocaleString('en-IN', {minimumFractionDigits: 2})}</p>
            </div>
            <div className="text-right">
                <p className="text-muted-foreground">Current Value</p>
                <p className="font-semibold">{totalPortfolioValue.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2 })}</p>
            </div>
        </div>

        <div className="flex items-center justify-around gap-2">
            <Button variant="outline" className="flex-1">
                <ArrowUpRight className="mr-2 h-4 w-4" /> Send
            </Button>
            <Button variant="outline" className="flex-1">
                <ArrowDownLeft className="mr-2 h-4 w-4" /> Receive
            </Button>
            <Button variant="outline" className="flex-1">
                <History className="mr-2 h-4 w-4" /> History
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}
