
'use client';

import * as React from 'react';
import { Header } from '@/components/dashboard/header';
import { Button } from '@/components/ui/button';
import { Download, FileText, CheckSquare, Clock, List, FileBadge, ArrowLeft } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

const reportItems = [
  {
    icon: FileText,
    title: 'Complete Tax Report',
    description: 'A detailed summary of all your crypto income, trades, and taxes. It includes every transaction required to compute your final tax liability.',
    iconColor: 'bg-blue-500/20 text-blue-500',
  },
  {
    icon: CheckSquare,
    title: 'Tax Filing Data Report',
    description: 'Summary of your total income, gains, and losses for the financial year for accurate tax filing.',
    iconColor: 'bg-orange-500/20 text-orange-500',
  },
  {
    icon: Clock,
    title: 'Income Summary Report',
    description: 'A consolidated report of all your crypto income earned during the year, including staking rewards, interest, airdrops, and other earnings.',
    iconColor: 'bg-green-500/20 text-green-500',
  },
  {
    icon: List,
    title: 'TDS Summary Report',
    description: 'A summary of all Tax Deducted at Source (TDS) on your crypto transactions for the financial year.',
    iconColor: 'bg-purple-500/20 text-purple-500',
  },
  {
    icon: FileBadge,
    title: 'TDS Certificate',
    description: 'Download your TDS certificate (Form 16A) for the selected quarter to claim tax credits.',
    iconColor: 'bg-teal-500/20 text-teal-500',
  },
  {
    icon: FileText,
    title: 'Brokerage GST Report',
    description: 'A report detailing the GST paid on brokerage fees for all your transactions.',
    iconColor: 'bg-indigo-500/20 text-indigo-500',
  },
];

export default function TaxyPage() {
    const router = useRouter();

  return (
    <div className="bg-background min-h-screen">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-xl font-bold">Tax Reports</h1>
          </div>
        </div>
      </header>
      
      <main className="p-4">
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex flex-wrap gap-2 justify-between items-center">
                <Button variant="outline">Previously Generated Reports</Button>
                <Button>
                    <Download className="mr-2 h-4 w-4" />
                    Download All
                </Button>
            </div>

            <div className="flex items-center gap-4">
                <label htmlFor="tax-year" className="text-sm font-medium text-muted-foreground">Tax Year:</label>
                <div className="flex-1">
                    <Select defaultValue="fy-2024-25">
                        <SelectTrigger id="tax-year" className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Select Tax Year" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="fy-2024-25">FY 2024-25</SelectItem>
                            <SelectItem value="fy-2023-24">FY 2023-24</SelectItem>
                            <SelectItem value="fy-2022-23">FY 2022-23</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="text-sm text-muted-foreground text-right">
                    <p>1 Apr '24 - 31 Mar '25</p>
                </div>
            </div>
            
            <div className="space-y-4">
                {reportItems.map((item, index) => (
                    <Card key={index} className="cursor-pointer hover:bg-muted/50 transition-colors">
                        <CardContent className="p-4 flex items-start gap-4">
                            <div className={`p-3 rounded-full ${item.iconColor}`}>
                                <item.icon className="h-6 w-6" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold">{item.title}</h3>
                                <p className="text-sm text-muted-foreground">{item.description}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
      </main>
    </div>
  );
}
