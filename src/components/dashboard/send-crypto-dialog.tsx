
"use client";

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { CryptoCurrency, Holding, Portfolio } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { QrCode } from 'lucide-react';

interface SendCryptoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  portfolio: Portfolio;
  marketData: CryptoCurrency[];
  onConfirm: (assetId: string, recipient: string, amount: number) => void;
}

export function SendCryptoDialog({ isOpen, onClose, portfolio, marketData, onConfirm }: SendCryptoDialogProps) {
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
    if (isOpen && portfolio.holdings.length > 0 && !assetId) {
        setAssetId(portfolio.holdings[0].cryptoId);
    }
  }, [isOpen, portfolio.holdings, assetId])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Send Crypto</DialogTitle>
          <DialogDescription>Transfer crypto assets to another wallet.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
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
                        className="pr-10"
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
                />
            </div>
        </div>
        <DialogFooter>
            <DialogClose asChild>
                <Button type="button" variant="ghost">
                Cancel
                </Button>
            </DialogClose>
          <Button onClick={handleConfirm}>Send</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
