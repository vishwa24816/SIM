import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CryptoCurrency } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Aperture } from "lucide-react";

interface MarketTableProps {
  cryptos: CryptoCurrency[];
  onRowClick: (crypto: CryptoCurrency) => void;
}

export function MarketTable({ cryptos, onRowClick }: MarketTableProps) {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="flex flex-row items-center justify-between p-6">
        <div className="flex items-center gap-3">
          <Aperture className="w-6 h-6 text-primary" />
          <h3 className="text-2xl font-semibold leading-none tracking-tight">Crypto & Web3 Holdings</h3>
        </div>
      </div>
      <div className="p-6 pt-0">
        <Table>
          <TableHeader className="hidden">
            <TableRow>
              <TableHead>Asset</TableHead>
              <TableHead className="text-right">Value & Change</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cryptos.map((crypto) => (
              <TableRow key={crypto.id} onClick={() => onRowClick(crypto)} className="cursor-pointer border-b-0">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <crypto.icon className="h-8 w-8" />
                    <div>
                      <div className="font-medium">{crypto.name}</div>
                      <div className="text-sm text-muted-foreground">{crypto.symbol}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="font-mono font-semibold">
                    ${crypto.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: crypto.price < 1 ? 6 : 2 })}
                  </div>
                   <div className={cn("text-sm", crypto.change24h >= 0 ? "text-green-500" : "text-red-500")}>
                    ({crypto.change24h.toFixed(2)}%)
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
