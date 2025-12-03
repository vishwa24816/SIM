
'use client';

import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { CryptoCurrency } from '@/lib/types';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// A simplified local store for watchlists
interface WatchlistState {
  watchlists: Record<string, string[]>;
  addWatchlist: (name: string) => void;
  addToWatchlist: (listName: string, cryptoId: string) => void;
}

const useLocalWatchlistStore = create<WatchlistState>()(
  persist(
    (set) => ({
      watchlists: { 'My First Watchlist': [] },
      addWatchlist: (name) => set((state) => ({
        watchlists: { ...state.watchlists, [name]: [] }
      })),
      addToWatchlist: (listName, cryptoId) => set((state) => {
        const list = state.watchlists[listName] || [];
        if (!list.includes(cryptoId)) {
          return {
            watchlists: {
              ...state.watchlists,
              [listName]: [...list, cryptoId],
            },
          };
        }
        return state;
      }),
    }),
    {
      name: 'local-watchlist-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

interface AddToWatchlistDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  crypto: CryptoCurrency;
}

export function AddToWatchlistDialog({ isOpen, onOpenChange, crypto }: AddToWatchlistDialogProps) {
  const { watchlists, addWatchlist, addToWatchlist } = useLocalWatchlistStore();
  const { toast } = useToast();

  const [basketType, setBasketType] = React.useState<'existing' | 'new'>('existing');
  const [selectedBasket, setSelectedBasket] = React.useState<string>(Object.keys(watchlists)[0] || '');
  const [newBasketName, setNewBasketName] = React.useState('');
  
  const watchlistNames = Object.keys(watchlists);

  React.useEffect(() => {
    if (watchlistNames.length === 0) {
      setBasketType('new');
    } else if (!selectedBasket) {
      setSelectedBasket(watchlistNames[0]);
    }
  }, [watchlistNames, selectedBasket]);

  const handleConfirm = () => {
    if (basketType === 'existing') {
      if (!selectedBasket) {
        toast({ variant: 'destructive', title: 'No watchlist selected', description: 'Please select a watchlist.' });
        return;
      }
      addToWatchlist(selectedBasket, crypto.id);
      toast({ title: 'Success', description: `${crypto.name} added to ${selectedBasket}.` });
    } else {
      if (!newBasketName.trim()) {
        toast({ variant: 'destructive', title: 'Invalid name', description: 'Please enter a name for the new watchlist.' });
        return;
      }
      addWatchlist(newBasketName.trim());
      addToWatchlist(newBasketName.trim(), crypto.id);
      toast({ title: 'Success', description: `${crypto.name} added to new watchlist "${newBasketName.trim()}".` });
      setNewBasketName('');
    }
    onOpenChange(false);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add {crypto.name} to Watchlist</DialogTitle>
          <DialogDescription>
            Organize your assets by adding them to a new or existing watchlist.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <RadioGroup value={basketType} onValueChange={(value) => setBasketType(value as 'existing' | 'new')} className="grid grid-cols-2 gap-4">
            <div>
              <RadioGroupItem value="existing" id="existing" className="peer sr-only" disabled={watchlistNames.length === 0}/>
              <Label htmlFor="existing" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                Existing
              </Label>
            </div>
            <div>
              <RadioGroupItem value="new" id="new" className="peer sr-only" />
              <Label htmlFor="new" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                New
              </Label>
            </div>
          </RadioGroup>

          {basketType === 'existing' && (
            <div className="space-y-2">
              <Label htmlFor="select-watchlist">Select Watchlist</Label>
              <Select value={selectedBasket} onValueChange={setSelectedBasket}>
                <SelectTrigger id="select-watchlist">
                  <SelectValue placeholder="Choose a watchlist" />
                </SelectTrigger>
                <SelectContent>
                  {watchlistNames.map(name => (
                    <SelectItem key={name} value={name}>{name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {basketType === 'new' && (
            <div className="space-y-2">
              <Label htmlFor="new-watchlist-name">New Watchlist Name</Label>
              <Input id="new-watchlist-name" value={newBasketName} onChange={(e) => setNewBasketName(e.target.value)} placeholder="e.g., 'My AI Coins'" />
            </div>
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
          <Button onClick={handleConfirm}>Add to Watchlist</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
