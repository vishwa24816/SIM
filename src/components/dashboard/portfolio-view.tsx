import * as React from "react";
import { Button } from "@/components/ui/button";
import { CryptoCurrency, Portfolio } from "@/lib/types";
import { ArrowUpRight, ArrowDownLeft, History, Bitcoin } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "../ui/separator";

interface PortfolioViewProps {
  portfolio: Portfolio;
  marketData: CryptoCurrency[];
  totalPortfolioValue: number;
}

export function PortfolioView({ portfolio, marketData, totalPortfolioValue }: PortfolioViewProps) {
  const overallPl = totalPortfolioValue - portfolio.usdBalance; // Simple P/L for example
  const overallPlPercent = portfolio.usdBalance > 0 ? (overallPl / portfolio.usdBalance) * 100 : 0;
  const dayPl = marketData.reduce((acc, crypto) => {
      const holding = portfolio.holdings.find(h => h.cryptoId === crypto.id);
      if (holding) {
          return acc + (holding.amount * (crypto.price * (crypto.change24h / 100)))
      }
      return acc;
  }, 0)
  const dayPlPercent = totalPortfolioValue > 0 ? (dayPl / totalPortfolioValue) * 100 : 0;

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="flex flex-col space-y-1.5 p-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-md">
            <Bitcoin className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-2xl font-semibold leading-none tracking-tight">Trading Wallet</h3>
        </div>
      </div>
      <div className="p-6 pt-0">
        <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
                <p className={cn("text-2xl font-bold", overallPl >= 0 ? "text-green-500" : "text-red-500")}>
                    {overallPl.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 })}
                </p>
                <p className="text-sm text-muted-foreground">Overall P&L ({overallPlPercent.toFixed(2)}%)</p>
            </div>
            <div className="text-right">
                <p className={cn("text-2xl font-bold", dayPl >= 0 ? "text-green-500" : "text-red-500")}>
                    {dayPl.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 })}
                </p>
                <p className="text-sm text-muted-foreground">Day's P&L ({dayPlPercent.toFixed(2)}%)</p>
            </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
                <p className="text-muted-foreground">Total Investment</p>
                <p className="font-semibold">${(portfolio.usdBalance).toLocaleString('en-US', {minimumFractionDigits: 2})}</p>
            </div>
            <div className="text-right">
                <p className="text-muted-foreground">Current Value</p>
                <p className="font-semibold">{totalPortfolioValue.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 })}</p>
            </div>
        </div>
      </div>
      <div className="flex items-center justify-center p-6 pt-0 gap-2">
          <Button variant="outline" size="sm" className="gap-1">
              <ArrowUpRight className="h-4 w-4" /> Send
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
              <ArrowDownLeft className="h-4 w-4" /> Receive
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
              <History className="h-4 w-4" /> History
          </Button>
      </div>
       <Separator />
        <div className="p-4 grid grid-cols-2 gap-4">
            <Button variant="default" className="w-full">Add Money</Button>
            <Button variant="secondary" className="w-full">Withdraw Money</Button>
        </div>
    </div>
  );
}
