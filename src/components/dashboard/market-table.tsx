import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CryptoCurrency } from "@/lib/types";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface MarketTableProps {
  cryptos: CryptoCurrency[];
  onRowClick: (crypto: CryptoCurrency) => void;
}

export function MarketTable({ cryptos, onRowClick }: MarketTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Market Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Asset</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">24h Change</TableHead>
              <TableHead className="text-right">24h Volume</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cryptos.map((crypto) => (
              <TableRow key={crypto.id} onClick={() => onRowClick(crypto)} className="cursor-pointer">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <crypto.icon className="h-8 w-8" />
                    <div>
                      <div className="font-medium">{crypto.name}</div>
                      <div className="text-sm text-muted-foreground">{crypto.symbol}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right font-mono">
                  ${crypto.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: crypto.price < 1 ? 6 : 2 })}
                </TableCell>
                <TableCell className={cn("text-right font-medium", crypto.change24h >= 0 ? "text-green-500" : "text-red-500")}>
                  <div className="flex items-center justify-end gap-1">
                     {crypto.change24h >= 0 ? <TrendingUp className="h-4 w-4"/> : <TrendingDown className="h-4 w-4"/>}
                    {crypto.change24h.toFixed(2)}%
                  </div>
                </TableCell>
                <TableCell className="text-right font-mono">
                  ${(crypto.volume24h / 1_000_000_000).toFixed(2)}B
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
