
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

interface ManageFundsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  action: 'add' | 'withdraw';
  balance: number;
  onConfirm: (amount: number) => void;
}

export function ManageFundsDialog({ isOpen, onClose, action, balance, onConfirm }: ManageFundsDialogProps) {
  const [amount, setAmount] = React.useState('');
  const { toast } = useToast();

  const title = action === 'add' ? 'Add Money' : 'Withdraw Money';
  const description = action === 'add'
    ? 'Enter the amount you want to add to your wallet.'
    : `Enter the amount you want to withdraw. Available: $${balance.toFixed(2)}`;

  const handleConfirm = () => {
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      toast({
        variant: 'destructive',
        title: 'Invalid Amount',
        description: 'Please enter a valid positive amount.',
      });
      return;
    }
    onConfirm(numericAmount);
    setAmount('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">
              Amount
            </Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="col-span-3"
              placeholder="$0.00"
            />
          </div>
        </div>
        <DialogFooter>
            <DialogClose asChild>
                <Button type="button" variant="secondary">
                Cancel
                </Button>
            </DialogClose>
          <Button onClick={handleConfirm}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
