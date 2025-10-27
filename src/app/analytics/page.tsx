
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function AnalyticsPage() {
  const router = useRouter();
  const [statementType, setStatementType] = React.useState<string | null>(null);

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
      </main>
    </div>
  );
}
