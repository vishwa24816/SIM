
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { CryptoCurrency, Portfolio } from "@/lib/types";
import { ArrowUpRight, ArrowDownLeft, History, Bitcoin, QrCode, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "../ui/separator";
import { ManageFundsDialog } from "./manage-funds-dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import QRCode from 'qrcode.react';
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { useWallets } from "@/hooks/use-wallets";
import { Skeleton } from "../ui/skeleton";
import { usePortfolioStore } from "@/hooks/use-portfolio";
import { useUser, useFirestore } from "@/firebase";

interface PortfolioViewProps {
    portfolio: Portfolio;
    marketData: CryptoCurrency[];
    totalPortfolioValue: number;
    dayPnl: number;
}


const SendCryptoForm = ({ portfolio, marketData, onConfirm, onCancel }: { portfolio: Portfolio, marketData: CryptoCurrency[], onConfirm: (assetId: string, recipient: string, amount: number) => void, onCancel: () => void }) => {
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
        onCancel();
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
                            className="bg-background"
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
                <div className="flex gap-2">
                    <Button onClick={onCancel} variant="outline" className="w-full">Cancel</Button>
                    <Button onClick={handleConfirm} className="w-full">Confirm & Send</Button>
                </div>
            </div>
        </div>
    );
};

const ReceiveCryptoForm = ({ portfolio, marketData, onCancel }: { portfolio: Portfolio, marketData: CryptoCurrency[], onCancel: () => void }) => {
    const [assetId, setAssetId] = React.useState<string>(portfolio.holdings[0]?.cryptoId || 'bitcoin');
    const { copy } = useCopyToClipboard();

    // Mock wallet address generation
    const walletAddress = React.useMemo(() => {
        return `0x${[...Array(40)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`;
    }, [assetId]);

    const handleCopy = () => {
        copy(walletAddress);
        toast({ title: "Address Copied!", description: "The wallet address has been copied to your clipboard." });
    };

    const { toast } = useToast();

    const availableAssets = marketData.filter(c => portfolio.holdings.some(h => h.cryptoId === c.id) || c.id === 'bitcoin');

    return (
        <div className="p-4 bg-muted/50 border-t text-center">
            <div className="space-y-4">
                <Select value={assetId} onValueChange={setAssetId}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select an asset" />
                    </SelectTrigger>
                    <SelectContent>
                        {availableAssets.map(asset => (
                            <SelectItem key={asset.id} value={asset.id}>
                                Receive {asset.name} ({asset.symbol})
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <div className="bg-white p-2 rounded-lg inline-block">
                    <QRCode value={walletAddress} size={160} />
                </div>
                
                <p className="text-xs text-muted-foreground break-all p-2 bg-background rounded-md">{walletAddress}</p>

                <div className="flex gap-2">
                    <Button variant="outline" onClick={onCancel} className="w-full">Close</Button>

                    <Button onClick={handleCopy} className="w-full">
                        <Copy className="mr-2 h-4 w-4" /> Copy Address
                    </Button>
                </div>
            </div>
        </div>
    );
};


export function PortfolioView({ portfolio, marketData, totalPortfolioValue, dayPnl }: PortfolioViewProps) {
  const { addUsd, withdrawUsd, getPortfolioValue } = usePortfolioStore();
  const [isManageFundsOpen, setIsManageFundsOpen] = React.useState(false);
  const [dialogAction, setDialogAction] = React.useState<'add' | 'withdraw'>('add');
  const [openSection, setOpenSection] = React.useState<'send' | 'receive' | null>(null);
  const { wallets } = useWallets();
  const [isClient, setIsClient] = React.useState(false);
  const { user } = useUser();
  const firestore = useFirestore();

  React.useEffect(() => {
    setIsClient(true);
  }, []);


  const primaryWallet = wallets.find(w => w.isPrimary);
  const walletName = primaryWallet ? primaryWallet.name : 'Trading Wallet';


  const handleOpenManageFunds = (action: 'add' | 'withdraw') => {
    setDialogAction(action);
    setIsManageFundsOpen(true);
  }

  const handleConfirmManageFunds = (amount: number) => {
    if (!user || !firestore) return;
    if (dialogAction === 'add') {
      addUsd(user, firestore, amount);
    } else {
      withdrawUsd(user, firestore, amount);
    }
    setIsManageFundsOpen(false);
  }

  const handleSendCrypto = (assetId: string, recipient: string, amount: number) => {
    console.log(`Sending ${amount} of ${assetId} to ${recipient}`);
    // Here you would integrate with a real sell/transfer function
    // For now, we just log it.
  }
  
  const handleToggleSection = (section: 'send' | 'receive') => {
      setOpenSection(prev => prev === section ? null : section);
  }
  
  const totalInvestment = portfolio.holdings.reduce((sum, h) => {
    return sum + (h.margin ?? 0);
  }, 0);
  
  const pnl = totalPortfolioValue - totalInvestment - portfolio.usdBalance;
  const pnlPercent = totalInvestment > 0 ? (pnl / totalInvestment) * 100 : 0;
  
  const holdingsValue = getPortfolioValue(marketData);
  const holdingsRatio = totalPortfolioValue > 0 ? (holdingsValue / totalPortfolioValue) * 100 : 0;


  return (
    <>
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="flex flex-col space-y-1.5 p-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-md">
            <Bitcoin className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-2xl font-semibold leading-none tracking-tight">{walletName}</h3>
        </div>
      </div>
      <div className="p-6 pt-0">
        <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              {isClient ? (
                <>
                  <p className={cn("text-2xl font-bold", pnl >= 0 ? "text-green-500" : "text-red-500")}>
                      {pnl.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-sm text-muted-foreground">Overall P&L ({pnlPercent.toFixed(2)}%)</p>
                </>
              ) : (
                <>
                  <Skeleton className="h-8 w-32 mb-1" />
                  <Skeleton className="h-4 w-24" />
                </>
              )}
            </div>
            <div className="text-right">
              {isClient ? (
                <>
                  <p className={cn("text-2xl font-bold", dayPnl >= 0 ? "text-green-500" : "text-red-500")}>
                      {dayPnl.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-sm text-muted-foreground">Day's P&L</p>
                </>
              ) : (
                 <>
                  <Skeleton className="h-8 w-24 mb-1 ml-auto" />
                  <Skeleton className="h-4 w-16 ml-auto" />
                </>
              )}
            </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
            <div>
                <p className="text-muted-foreground">Total Investment</p>
                {isClient ? <p className="font-semibold">₹{totalInvestment.toLocaleString('en-IN', {minimumFractionDigits: 2})}</p> : <Skeleton className="h-5 w-20 mt-1" />}
            </div>
            <div className="text-right">
                <p className="text-muted-foreground">Current Value</p>
                {isClient ? <p className="font-semibold">{totalPortfolioValue.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2 })}</p> : <Skeleton className="h-5 w-28 mt-1 ml-auto" />}
            </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
             <div>
                <p className="text-muted-foreground">Cash Balance</p>
                {isClient ? <p className="font-semibold">₹{portfolio.usdBalance.toLocaleString('en-IN', {minimumFractionDigits: 2})}</p> : <Skeleton className="h-5 w-24 mt-1" />}
            </div>
            <div className="text-right">
                <p className="text-muted-foreground">Holdings/Position Ratio</p>
                {isClient ? <p className="font-semibold">{holdingsRatio.toFixed(2)}%</p> : <Skeleton className="h-5 w-16 mt-1 ml-auto" />}
            </div>
        </div>
      </div>
      <div className="flex items-center justify-center p-6 pt-0 gap-2">
          <Button variant="outline" size="sm" className="gap-1" onClick={() => handleToggleSection('send')} data-state={openSection === 'send' ? 'open' : 'closed'}>
              <ArrowUpRight className="h-4 w-4" /> Send
          </Button>
          <Button variant="outline" size="sm" className="gap-1" onClick={() => handleToggleSection('receive')} data-state={openSection === 'receive' ? 'open' : 'closed'}>
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

        <Collapsible open={openSection === 'send'} onOpenChange={(isOpen) => !isOpen && setOpenSection(null)}>
            <CollapsibleContent>
                <SendCryptoForm portfolio={portfolio} marketData={marketData} onConfirm={handleSendCrypto} onCancel={() => setOpenSection(null)} />
            </CollapsibleContent>
        </Collapsible>
        <Collapsible open={openSection === 'receive'} onOpenChange={(isOpen) => !isOpen && setOpenSection(null)}>
            <CollapsibleContent>
                <ReceiveCryptoForm portfolio={portfolio} marketData={marketData} onCancel={() => setOpenSection(null)} />
            </CollapsibleContent>
        </Collapsible>
    </div>
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
