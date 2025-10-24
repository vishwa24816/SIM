import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CryptoCurrency, Portfolio } from "@/lib/types";
import { Wallet } from "lucide-react";

interface PortfolioViewProps {
  portfolio: Portfolio;
  marketData: CryptoCurrency[];
  totalPortfolioValue: number;
}

export function PortfolioView({ portfolio, marketData, totalPortfolioValue }: PortfolioViewProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Wallet className="w-6 h-6 text-accent" />
          <div>
            <CardTitle>My Portfolio</CardTitle>
            <CardDescription>Your simulated assets overview</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
            <p className="text-sm text-muted-foreground">Total Value</p>
            <p className="text-2xl font-bold">
                ${totalPortfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Asset</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">Value (USD)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
                <TableCell>
                    <div className="font-medium">US Dollar</div>
                    <div className="text-sm text-muted-foreground">USD</div>
                </TableCell>
                <TableCell className="text-right font-mono">{portfolio.usdBalance.toFixed(2)}</TableCell>
                <TableCell className="text-right font-mono">${portfolio.usdBalance.toFixed(2)}</TableCell>
            </TableRow>
            {portfolio.holdings.map((holding) => {
              const crypto = marketData.find(c => c.id === holding.cryptoId);
              if (!crypto) return null;
              const value = holding.amount * crypto.price;
              return (
                <TableRow key={holding.cryptoId}>
                  <TableCell>
                     <div className="flex items-center gap-2">
                        <crypto.icon className="h-6 w-6" />
                        <div>
                            <div className="font-medium">{crypto.name}</div>
                            <div className="text-sm text-muted-foreground">{crypto.symbol}</div>
                        </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono">{holding.amount.toFixed(6)}</TableCell>
                  <TableCell className="text-right font-mono">${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
