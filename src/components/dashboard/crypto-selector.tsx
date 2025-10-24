import * as React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CryptoCurrency } from '@/lib/types';

interface CryptoSelectorProps {
  cryptos: CryptoCurrency[];
  selectedCryptoId: string;
  onValueChange: (id: string) => void;
  className?: string;
}

export function CryptoSelector({ cryptos, selectedCryptoId, onValueChange, className }: CryptoSelectorProps) {
  return (
    <Select value={selectedCryptoId} onValueChange={onValueChange}>
      <SelectTrigger className={`w-full sm:w-[240px] text-lg font-semibold py-6 ${className}`}>
        <SelectValue placeholder="Select a cryptocurrency" />
      </SelectTrigger>
      <SelectContent>
        {cryptos.map(crypto => (
          <SelectItem key={crypto.id} value={crypto.id}>
            <div className="flex items-center gap-2">
              <crypto.icon className="w-5 h-5" />
              <span>{crypto.name} ({crypto.symbol})</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
