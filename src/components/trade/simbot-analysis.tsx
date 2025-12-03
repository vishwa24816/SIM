
'use client';

import * as React from 'react';
import { Bot } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { CryptoCurrency } from '@/lib/types';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { NewsFeed } from '../dashboard/news-feed';


interface SimbotAnalysisProps {
    crypto: CryptoCurrency;
    showTabs?: boolean;
}
export function SimbotAnalysis({ crypto, showTabs = false }: SimbotAnalysisProps) {
    const [activeTab, setActiveTab] = React.useState('Overview');
    const TABS = ['Overview', 'Technicals', 'Analysis', 'News'];

    const renderContent = () => {
        switch (activeTab) {
            case 'Overview':
                return (
                     <div className="p-6 pt-0">
                        <div className="flex gap-3">
                            <Avatar>
                                <AvatarFallback>B</AvatarFallback>
                            </Avatar>
                            <div className="p-3 bg-muted rounded-lg text-sm">
                                <p>Based on recent trends, {crypto.name} ({crypto.symbol}) is showing strong bullish momentum. Key indicators suggest a potential breakout above the ${crypto.price.toFixed(4)} level in the short term.</p>
                            </div>
                        </div>
                    </div>
                );
            case 'Technicals':
                 return <div className="p-6 text-center text-muted-foreground">Technicals data coming soon.</div>;
            case 'Analysis':
                return <div className="p-6 text-center text-muted-foreground">Analysis data coming soon.</div>;
            case 'News':
                return <div className="p-6"><NewsFeed /></div>
            default:
                return null;
        }
    }

  return (
    <div>
        {showTabs && (
             <div className="border-b border-border">
                <div className="overflow-x-auto px-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground whitespace-nowrap">
                        {TABS.map((tab) => (
                            <Button
                                key={tab}
                                variant="ghost"
                                size="sm"
                                onClick={() => setActiveTab(tab)}
                                className={cn("px-3", activeTab === tab ? 'text-primary' : '')}
                            >
                                {tab}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>
        )}
        <div className="flex flex-col space-y-1.5 p-6">
            <div className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                <h3 className="text-lg font-semibold leading-none tracking-tight">Veda {activeTab}</h3>
            </div>
        </div>
        {renderContent()}
    </div>
  );
}
