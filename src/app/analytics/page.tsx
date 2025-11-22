
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Download, ArrowUp, CheckCircle, ChevronDown, ChevronUp, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useTransactionHistory } from '@/hooks/use-transaction-history';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const TransactionRow = ({ label, value, valueClassName }: { label: string, value: string | React.ReactNode, valueClassName?: string }) => (
  <div className="flex justify-between items-center text-sm py-2">
    <p className="text-muted-foreground">{label}</p>
    <p className={cn("font-medium", valueClassName)}>{value}</p>
  </div>
);

export default function AnalyticsPage() {
  const router = useRouter();
  const [statementType, setStatementType] = React.useState<string | null>(null);
  const { transactions } = useTransactionHistory();
  const [openAccordion, setOpenAccordion] = React.useState<string | undefined>(transactions[0]?.id);

  return (
    <div className="bg-background min-h-screen">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-lg font-semibold">Analytics</h1>
          </div>
        </div>
      </header>
      
      <main className="p-4 space-y-4">
        <Select onValueChange={setStatementType}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Statement Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pnl">P&L Statement</SelectItem>
            <SelectItem value="tradebook">Tradebook</SelectItem>
            <SelectItem value="holdings">Holdings Statement</SelectItem>
            <SelectItem value="tax">Tax P&L Statement</SelectItem>
          </SelectContent>
        </Select>

        <Button className="w-full justify-between" variant="outline" disabled={!statementType}>
          <span>Download Statement</span>
          <Download className="h-5 w-5" />
        </Button>
        
        <div className="pt-4">
            <h2 className="text-lg font-semibold mb-2">Recent Transactions</h2>
             {transactions.length === 0 ? (
                <div className="text-center text-muted-foreground py-10">
                    <p>You have no transactions yet.</p>
                </div>
            ) : (
                <Accordion type="single" collapsible value={openAccordion} onValueChange={setOpenAccordion} className="w-full space-y-2">
                    {transactions.map(tx => {
                        const isBuy = tx.type === 'BUY';
                        // Mock P&L for now. In a real app, this would be calculated based on cost basis.
                        const pnl = isBuy ? null : tx.totalValue * (Math.random() * 0.2 - 0.1);

                        return (
                            <AccordionItem value={tx.id} key={tx.id} className="border-b-0">
                                <div className="p-4 bg-card rounded-lg border">
                                    <AccordionTrigger className="py-0 hover:no-underline">
                                        <div className="flex items-center gap-3 w-full">
                                            <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", isBuy ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500')}>
                                                <ArrowUp className={cn("h-6 w-6", !isBuy && 'rotate-180')} />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-left">{isBuy ? 'Bought' : 'Sold'} {tx.quantity.toFixed(2)} {tx.asset} @</p>
                                                <p className="text-sm text-muted-foreground text-left">{tx.priceAtTransaction.toLocaleString('en-IN')}</p>
                                                <p className="text-xs text-muted-foreground text-left">{new Date(tx.date).toLocaleDateString('en-CA')}</p>
                                            </div>
                                            <div className="ml-auto text-right">
                                                <p className="font-bold text-lg">{tx.totalValue.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</p>
                                                {openAccordion === tx.id ? <ChevronUp className="h-4 w-4 ml-auto" /> : <ChevronDown className="h-4 w-4 ml-auto" />}
                                            </div>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="pt-4">
                                        <Badge className="bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20 w-full justify-center">
                                            <CheckCircle className="h-4 w-4 mr-2" /> Blockchain verified: #{tx.blockchainId}
                                        </Badge>
                                        <div className="mt-4">
                                            <TransactionRow label="Brokerage" value={tx.brokerage.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })} />
                                            <TransactionRow 
                                                label="Profit/Loss"
                                                value={pnl !== null ? pnl.toLocaleString('en-IN', { style: 'currency', currency: 'INR' }) : 'N/A'}
                                                valueClassName={pnl !== null ? (pnl >= 0 ? 'text-green-500' : 'text-red-500') : ''}
                                            />
                                            <TransactionRow label="Brokerage Earned Back" value={tx.brokerageEarnedBack.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })} />
                                            <TransactionRow label="Crypto Platform" value={tx.platform} />
                                        </div>
                                    </AccordionContent>
                                </div>
                            </AccordionItem>
                        )
                    })}
                </Accordion>
            )}
        </div>
      </main>
    </div>
  );
}
