
"use client";

import * as React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { CryptoCurrency, Portfolio } from "@/lib/types";
import { PieChart } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "../ui/button";

interface CryptoPositionsProps {
  portfolio: Portfolio;
  marketData: CryptoCurrency[];
}

const HoldingsAccordion = ({ holdings }: { holdings: any[] }) => {
  if (holdings.length === 0) {
    return (
      <div className="flex items-center justify-center h-24 rounded-lg bg-secondary/50">
        <p className="text-muted-foreground">You have no holdings.</p>
      </div>
    );
  }

  const getAssetPath = (item: { assetType?: string, id: string }) => {
    switch (item.assetType) {
        case 'Crypto ETF': return `/trade/etf/${item.id}`;
        case 'Mutual Fund': return `/trade/mutual-fund/${item.id}`;
        case 'Web3': return `/trade/web3/${item.id}`;
        case 'Futures': return `/trade/futures/${item.id}`;
        case 'Spot': return `/trade/${item.id}`;
        default: return `/crypto/${item.id}`;
    }
  }

  return (
    <Accordion type="single" collapsible className="w-full">
      {holdings.map((holding) => (
        <AccordionItem value={holding.crypto.id} key={holding.crypto.id}>
          <AccordionTrigger>
            <div className="flex items-center gap-3 w-full">
              <holding.crypto.icon className="h-8 w-8" />
              <div>
                <div className="font-semibold">{holding.crypto.name}</div>
                <div className="text-xs text-muted-foreground">{holding.crypto.symbol}</div>
              </div>
              <div className="ml-auto text-right">
                <div className="font-mono font-semibold">
                  ${holding.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                 <div className={cn("text-sm", holding.crypto.change24h >= 0 ? "text-green-500" : "text-red-500")}>
                    ({holding.crypto.change24h.toFixed(2)}%)
                  </div>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="p-2 bg-muted/50 rounded-md">
                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                    <div>
                        <p className="text-muted-foreground">Quantity</p>
                        <p className="font-semibold">{holding.amount.toFixed(6)}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-muted-foreground">Current Price</p>
                        <p className="font-semibold">${holding.crypto.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: holding.crypto.price < 1 ? 6 : 2 })}</p>
                    </div>
                </div>
                 <Link href={getAssetPath(holding.crypto)} passHref>
                    <Button size="sm" className="w-full">Trade</Button>
                </Link>
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};


const FuturesAccordion = ({ positions }: { positions: any[] }) => {
    if (positions.length === 0) {
        return (
            <div className="flex items-center justify-center h-24 rounded-lg bg-secondary/50">
                <p className="text-muted-foreground">You have no futures positions.</p>
            </div>
        );
    }
    
    const getAssetPath = (item: { assetType?: string, id: string }) => {
        return `/trade/futures/${item.id}`;
    }

    return (
        <Accordion type="single" collapsible className="w-full">
            {positions.map((holding) => (
                <AccordionItem value={holding.crypto.id} key={holding.crypto.id}>
                    <AccordionTrigger>
                        <div className="flex items-center gap-3 w-full">
                            <holding.crypto.icon className="h-8 w-8" />
                            <div>
                                <div className="font-semibold">{holding.crypto.name}</div>
                                <div className="text-xs text-muted-foreground">{holding.crypto.symbol}</div>
                            </div>
                            <div className="ml-auto text-right">
                                <div className="font-mono font-semibold">
                                    ${(holding.margin ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </div>
                                <p className="text-xs text-muted-foreground">Margin</p>
                            </div>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="p-2 bg-muted/50 rounded-md">
                            <div className="grid grid-cols-3 gap-4 text-sm mb-4">
                                <div>
                                    <p className="text-muted-foreground">Quantity</p>
                                    <p className="font-semibold">{holding.amount.toFixed(4)}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-muted-foreground">Entry Price</p>
                                    <p className="font-semibold">${(holding.margin / holding.amount * holding.leverage).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-muted-foreground">Current Price</p>
                                    <p className="font-semibold">${holding.baseAssetPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                </div>
                            </div>
                            <Link href={getAssetPath(holding.crypto)} passHref>
                                <Button size="sm" className="w-full">Trade</Button>
                            </Link>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    );
};


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
    .filter((holding): holding is NonNullable<typeof holding> => holding !== null)
    .sort((a, b) => b.value - a.value);

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
        <div className="px-6 pb-6">
          <HoldingsAccordion holdings={holdingsWithValue} />
        </div>
      </div>
      
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-row items-center justify-between p-6">
          <div className="flex items-center gap-3">
            <PieChart className="w-6 h-6 text-primary" />
            <h3 className="text-2xl font-semibold leading-none tracking-tight">Futures Positions</h3>
          </div>
        </div>
        <div className="px-6 pb-6">
          <FuturesAccordion positions={futuresPositions} />
        </div>
      </div>
    </>
  );
}
