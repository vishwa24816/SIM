"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CryptoCurrency, Portfolio } from "@/lib/types";

interface TradingPanelProps {
  selectedCrypto: CryptoCurrency;
  portfolio: Portfolio;
  onBuy: (cryptoId: string, inrAmount: number, quantity: number) => void;
  onSell: (cryptoId: string, cryptoAmount: number) => void;
}

export function TradingPanel({ selectedCrypto, portfolio, onBuy, onSell }: TradingPanelProps) {
  const [buyAmount, setBuyAmount] = React.useState("");
  const [sellAmount, setSellAmount] = React.useState("");

  const handleBuy = () => {
    const amountInr = parseFloat(buyAmount);
    if (!amountInr || amountInr <= 0 || selectedCrypto.price <= 0) return;
    const quantity = amountInr / selectedCrypto.price;
    onBuy(selectedCrypto.id, amountInr, quantity);
    setBuyAmount("");
  };

  const handleSell = () => {
    onSell(selectedCrypto.id, parseFloat(sellAmount));
    setSellAmount("");
  };

  const currentHolding = portfolio.holdings.find(h => h.cryptoId === selectedCrypto.id)?.amount || 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trade</CardTitle>
        <CardDescription>Buy or sell {selectedCrypto.name}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="buy" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="buy">Buy</TabsTrigger>
            <TabsTrigger value="sell">Sell</TabsTrigger>
          </TabsList>
          <TabsContent value="buy">
            <div className="space-y-4 pt-4">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Available:</span>
                <span>₹{portfolio.usdBalance.toFixed(2)}</span>
              </div>
              <div className="space-y-2">
                <Label htmlFor="buy-amount">Amount in INR</Label>
                <Input
                  id="buy-amount"
                  type="number"
                  placeholder="0.00"
                  value={buyAmount}
                  onChange={(e) => setBuyAmount(e.target.value)}
                />
              </div>
              <Button onClick={handleBuy} className="w-full bg-green-600 hover:bg-green-700 text-white">
                Buy {selectedCrypto.symbol}
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="sell">
            <div className="space-y-4 pt-4">
               <div className="flex justify-between text-sm text-muted-foreground">
                <span>Available:</span>
                <span>{currentHolding.toFixed(6)} {selectedCrypto.symbol}</span>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sell-amount">Amount in {selectedCrypto.symbol}</Label>
                <Input
                  id="sell-amount"
                  type="number"
                  placeholder="0.00"
                  value={sellAmount}
                  onChange={(e) => setSellAmount(e.target.value)}
                />
              </div>
              <Button onClick={handleSell} className="w-full bg-red-600 hover:bg-red-700 text-white">
                Sell {selectedCrypto.symbol}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
