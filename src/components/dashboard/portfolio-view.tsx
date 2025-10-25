
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { CryptoCurrency, Portfolio } from "@/lib/types";
import { ArrowUpRight, ArrowDownLeft, History, Bitcoin, QrCode } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "../ui/separator";
import { ManageFundsDialog } from "./manage-funds-dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface PortfolioViewProps {
  portfolio: Portfolio;
  marketData: CryptoCurrency[];
  totalPortfolioValue: number;
  addUsd: (amount: number) => void;
  withdrawUsd: (amount: number) => void;
}

const SendCryptoForm = ({ portfolio, marketData, onConfirm }: { portfolio: Portfolio, marketData: CryptoCurrency[], onConfirm: (assetId: string, recipient: string, amount: number) => void }) => {
    const [assetId, setAssetId] = React.useState<string>(portfolio.holdings[0]?.cryptoId || '');
    const [recipient, setRecipient] = React.useState('');
    const [amount, setAmount] = React.useState('');
    const { toast } = useToast();

    const holdingsWithOptions = portfolio.holdings.map(holding => {
        const crypto = marketData.find(c => c.id === holding.cryptoId);
        return {
            ...holding,
            crypto,
        };
    }).filter(h => h.crypto);

    const selectedHolding = holdingsWithOptions.find(h => h.cryptoId === assetId);

    const handleConfirm = () => {
        const numericAmount = parseFloat(amount);
        if (!assetId || !recipient || !amount) {
            toast({ variant: "destructive", title: "Missing Information", description: "Please fill out all fields." });
            return;
        }
        if (isNaN(numericAmount) || numericAmount <= 0) {
            toast({ variant: "destructive", title: "Invalid Amount", description: "Please enter a valid positive amount." });
            return;
        }
        if (selectedHolding && numericAmount > selectedHolding.amount) {
            toast({ variant: "destructive", title: "Insufficient Balance", description: `You only have ${selectedHolding.amount.toFixed(6)} ${selectedHolding.crypto?.symbol} available.` });
            return;
        }
        onConfirm(assetId, recipient, numericAmount);
        setRecipient('');
        setAmount('');
    };
    
    React.useEffect(() => {
        if (portfolio.holdings.length > 0 && !assetId) {
            setAssetId(portfolio.holdings[0].cryptoId);
        }
    }, [portfolio.holdings, assetId]);
    
    return (
        <div className="p-4 bg-muted/50 border-t">
            <div className="grid gap-6">
                <div className="space-y-2">
                    <Label htmlFor="asset">Asset</Label>
                    <Select value={assetId} onValueChange={setAssetId}>
                        <SelectTrigger id="asset">
                            <SelectValue placeholder="Select an asset" />
                        </SelectTrigger>
                        <SelectContent>
                            {holdingsWithOptions.map(holding => (
                                <SelectItem key={holding.cryptoId} value={holding.cryptoId}>
                                    {holding.crypto?.name} ({holding.crypto?.symbol}) - Bal: {holding.amount.toFixed(6)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="recipient">Recipient's Address</Label>
                    <div className="relative">
                        <Input
                            id="recipient"
                            value={recipient}
                            onChange={(e) => setRecipient(e.target.value)}
                            placeholder="0x..."
                            className="pr-10 bg-background"
                        />
                        <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8">
                            <QrCode className="h-5 w-5 text-muted-foreground"/>
                        </Button>
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                        id="amount"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        className="bg-background"
                    />
                </div>
                <Button onClick={handleConfirm}>Confirm & Send</Button>
            </div>
        </div>
    );
};


export function PortfolioView({ portfolio, marketData, totalPortfolioValue, addUsd, withdrawUsd }: PortfolioViewProps) {
  const [isManageFundsOpen, setIsManageFundsOpen] = React.useState(false);
  const [dialogAction, setDialogAction] = React.useState<'add' | 'withdraw'>('add');

  const handleOpenManageFunds = (action: 'add' | 'withdraw') => {
    setDialogAction(action);
    setIsManageFundsOpen(true);
  }

  const handleConfirmManageFunds = (amount: number) => {
    if (dialogAction === 'add') {
      addUsd(amount);
    } else {
      withdrawUsd(amount);
    }
    setIsManageFundsOpen(false);
  }

  const handleSendCrypto = (assetId: string, recipient: string, amount: number) => {
    console.log(`Sending ${amount} of ${assetId} to ${recipient}`);
    // Here you would integrate with a real sell/transfer function
    // For now, we just log it.
  }


  return (
    <>
    <Collapsible className="rounded-lg border bg-card text-card-foreground shadow-sm">
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
                <p className={cn("text-2xl font-bold", totalPortfolioValue >= portfolio.usdBalance ? "text-green-500" : "text-red-500")}>
                    {(totalPortfolioValue - portfolio.usdBalance).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 })}
                </p>
                <p className="text-sm text-muted-foreground">Overall P&L ({ (portfolio.usdBalance > 0 ? ((totalPortfolioValue - portfolio.usdBalance) / portfolio.usdBalance) * 100 : 0).toFixed(2)}%)</p>
            </div>
            <div className="text-right">
                 <p className={cn("text-2xl font-bold", marketData.reduce((acc, c) => acc + c.change24h, 0) >= 0 ? "text-green-500" : "text-red-500")}>
                    {marketData.reduce((acc, crypto) => {
                        const holding = portfolio.holdings.find(h => h.cryptoId === crypto.id);
                        if (holding) {
                            return acc + (holding.amount * crypto.price * (crypto.change24h / 100));
                        }
                        return acc;
                    }, 0).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 })}
                </p>
                <p className="text-sm text-muted-foreground">Day's P&L</p>
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
          <CollapsibleTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1">
                <ArrowUpRight className="h-4 w-4" /> Send
            </Button>
          </CollapsibleTrigger>
          <Button variant="outline" size="sm" className="gap-1">
              <ArrowDownLeft className="h-4 w-4" /> Receive
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
              <History className="h-4 w-4" /> History
          </Button>
      </div>
       <Separator />
        <div className="p-4 grid grid-cols-2 gap-4">
            <Button variant="default" className="w-full" onClick={() => handleOpenManageFunds('add')}>Add Money</Button>
            <Button variant="secondary" className="w-full" onClick={() => handleOpenManageFunds('withdraw')}>Withdraw Money</Button>
        </div>

      <CollapsibleContent>
        <SendCryptoForm portfolio={portfolio} marketData={marketData} onConfirm={handleSendCrypto} />
      </CollapsibleContent>
    </Collapsible>
    <ManageFundsDialog 
        isOpen={isManageFundsOpen}
        onClose={() => setIsManageFundsOpen(false)}
        action={dialogAction}
        balance={portfolio.usdBalance}
        onConfirm={handleConfirmManageFunds}
    />
    </>
  );
}
