
'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useBaskets } from '@/hooks/use-baskets';
import { useToast } from '@/hooks/use-toast';
import { BasketItem, CryptoCurrency } from '@/lib/types';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';

interface AddToBasketDialogProps {
  isOpen: boolean;
  onClose: () => void;
  instrument: BasketItem;
}

export function AddToBasketDialog({ isOpen, onClose, instrument }: AddToBasketDialogProps) {
  const { baskets, addToBasket, createAndAddToBasket } = useBaskets();
  const { toast } = useToast();
  
  const [basketType, setBasketType] = React.useState<'existing' | 'new'>('existing');
  const [selectedBasket, setSelectedBasket] = React.useState<string>(baskets[0]?.name || '');
  const [newBasketName, setNewBasketName] = React.useState('');

  React.useEffect(() => {
    // If there are no existing baskets, default to creating a new one.
    if (baskets.length === 0) {
      setBasketType('new');
    } else {
      setBasketType('existing');
      setSelectedBasket(baskets[0].name);
    }
  }, [baskets, isOpen]);


  const handleConfirm = () => {
    const itemToAdd: BasketItem = {
      id: instrument.id,
      name: instrument.name,
      symbol: instrument.symbol,
      assetType: instrument.assetType,
    };

    if (basketType === 'existing') {
      if (!selectedBasket) {
        toast({ variant: 'destructive', title: 'No basket selected', description: 'Please select a basket.' });
        return;
      }
      addToBasket(selectedBasket, itemToAdd);
      toast({ title: 'Success', description: `${instrument.name} added to ${selectedBasket}.` });
    } else {
      if (!newBasketName.trim()) {
        toast({ variant: 'destructive', title: 'Invalid name', description: 'Please enter a name for the new basket.' });
        return;
      }
      createAndAddToBasket(newBasketName.trim(), itemToAdd);
      toast({ title: 'Success', description: `${instrument.name} added to new basket "${newBasketName.trim()}".` });
      setNewBasketName('');
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add to Basket</DialogTitle>
          <DialogDescription>Add "{instrument.name}" to a new or existing basket.</DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-6">
            <RadioGroup value={basketType} onValueChange={(value) => setBasketType(value as 'existing' | 'new')} className="grid grid-cols-2 gap-4">
                <div>
                    <RadioGroupItem value="existing" id="existing" className="peer sr-only" disabled={baskets.length === 0} />
                    <Label htmlFor="existing" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                        Existing Basket
                    </Label>
                </div>
                 <div>
                    <RadioGroupItem value="new" id="new" className="peer sr-only" />
                    <Label htmlFor="new" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                       New Basket
                    </Label>
                </div>
            </RadioGroup>

            {basketType === 'existing' && (
                 <div className="space-y-2">
                    <Label htmlFor="select-basket">Select Basket</Label>
                    <Select value={selectedBasket} onValueChange={setSelectedBasket}>
                        <SelectTrigger id="select-basket">
                            <SelectValue placeholder="Choose a basket" />
                        </SelectTrigger>
                        <SelectContent>
                            {baskets.map(basket => (
                                <SelectItem key={basket.name} value={basket.name}>{basket.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                 </div>
            )}

             {basketType === 'new' && (
                <div className="space-y-2">
                    <Label htmlFor="new-basket-name">New Basket Name</Label>
                    <Input id="new-basket-name" value={newBasketName} onChange={(e) => setNewBasketName(e.target.value)} placeholder="e.g., 'My AI Coins'" />
                </div>
            )}

        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleConfirm}>Add to Basket</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
