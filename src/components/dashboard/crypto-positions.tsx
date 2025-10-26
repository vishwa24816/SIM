
"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CryptoCurrency, Portfolio } from "@/lib/types";
import { PieChart } from "lucide-react";

interface CryptoPositionsProps {
  portfolio: Portfolio;
  marketData: CryptoCurrency[];
}

export function CryptoPositions({ portfolio, marketData }: CryptoPositionsProps) {
  const holdingsWithValue = portfolio.holdings
    .map(holding => {
      const crypto = marketData.find(c => c.id === holding.cryptoId);
      if (!crypto || crypto.assetType === 'Futures') return null;
      const value = holding.amount * crypto.price;
      return {
        ...holding,
        crypto,
        value,
      };
    })
    .filter((holding): holding is NonNullable<typeof holding> => holding !== null);

    const futuresPositions = portfolio.holdings
    .map(holding => {
      const crypto = marketData.find(c => c.id === holding.cryptoId);
       if (!crypto || crypto.assetType !== 'Futures') return null;

      const baseAssetId = crypto.id.replace('-fut', '');
      const baseAsset = marketData.find(c => c.id === baseAssetId && c.assetType === 'Spot');
      
      if (!baseAsset) return null;

      const value = holding.amount * baseAsset.price;
      const leverage = (holding.amount * baseAsset.price) / holding.margin!;

      return {
        ...holding,
        crypto,
        value,
        leverage: isNaN(leverage) ? 0 : leverage,
        baseAssetPrice: baseAsset.price
      };
    })
    .filter((holding): holding is NonNullable<typeof holding> => holding !== null);

  return (
    <>
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-row items-center justify-between p-6">
          <div className="flex items-center gap-3">
            <PieChart className="w-6 h-6 text-primary" />
            <h3 className="text-2xl font-semibold leading-none tracking-tight">Holdings</h3>
          </div>
        </div>
        <div className="p-6 pt-0">
          {holdingsWithValue.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Asset</TableHead>
                  <TableHead>Qty.</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {holdingsWithValue.map((holding) => (
                  <TableRow key={holding.crypto.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <holding.crypto.icon className="h-8 w-8" />
                        <div>
                          <div className="font-medium">{holding.crypto.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {holding.crypto.symbol}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {holding.amount.toFixed(6)}
                    </TableCell>
                    <TableCell>
                      ${holding.crypto.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: holding.crypto.price < 1 ? 6 : 2 })}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="font-mono font-semibold">
                        ${holding.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex items-center justify-center h-24 rounded-lg bg-secondary/50">
              <p className="text-muted-foreground">You have no holdings.</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-row items-center justify-between p-6">
          <div className="flex items-center gap-3">
            <PieChart className="w-6 h-6 text-primary" />
            <h3 className="text-2xl font-semibold leading-none tracking-tight">Futures Positions</h3>
          </div>
        </div>
        <div className="p-6 pt-0">
          {futuresPositions.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Asset</TableHead>
                  <TableHead>Qty.</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="text-right">Margin</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {futuresPositions.map((holding) => (
                  <TableRow key={holding.crypto.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <holding.crypto.icon className="h-8 w-8" />
                        <div>
                          <div className="font-medium">{holding.crypto.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {holding.crypto.symbol}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {holding.amount.toFixed(4)}
                    </TableCell>
                    <TableCell>
                      ${holding.baseAssetPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: holding.baseAssetPrice < 1 ? 6 : 2 })}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="font-mono font-semibold">
                        ${(holding.margin ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex items-center justify-center h-24 rounded-lg bg-secondary/50">
              <p className="text-muted-foreground">You have no futures positions.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
