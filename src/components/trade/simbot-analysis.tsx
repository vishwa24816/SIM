
'use client';

import * as React from 'react';
import { Bot, Send } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { CryptoCurrency } from '@/lib/types';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { NewsFeed } from '../dashboard/news-feed';
import { Input } from '../ui/input';

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

interface SimbotAnalysisProps {
    crypto: CryptoCurrency;
    showTabs?: boolean;
}
export function SimbotAnalysis({ crypto, showTabs = false }: SimbotAnalysisProps) {
    const [activeTab, setActiveTab] = React.useState('Overview');
    const TABS = ['Overview', 'Technicals', 'Analysis', 'News'];
    
    const [messages, setMessages] = React.useState<Message[]>([
        { sender: 'bot', text: `Based on recent trends, ${crypto.name} (${crypto.symbol}) is showing strong bullish momentum. Key indicators suggest a potential breakout above the ₹${crypto.price.toFixed(4)} level in the short term.`}
    ]);
    const [inputValue, setInputValue] = React.useState('');

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        setMessages(prev => [...prev, { sender: 'user', text: inputValue }]);
        setInputValue('');

        // Simulate bot response
        setTimeout(() => {
            setMessages(prev => [...prev, { sender: 'bot', text: "I'm sorry, my AI features are currently being upgraded. Please check back later."}]);
        }, 1000);
    }

    const renderContent = () => {
        switch (activeTab) {
            case 'Overview':
                return (
                     <div className="p-6 pt-0 space-y-4">
                        {messages.map((message, index) => (
                             <div key={index} className={cn("flex items-start gap-3", message.sender === 'user' ? 'justify-end' : '')}>
                                {message.sender === 'bot' && (
                                    <Avatar>
                                        <AvatarFallback><Bot /></AvatarFallback>
                                    </Avatar>
                                )}
                                <div className={cn("p-3 rounded-lg text-sm max-w-xs", message.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
                                    <p>{message.text}</p>
                                </div>
                            </div>
                        ))}
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

        {activeTab === 'Overview' && (
            <div className="p-4 border-t">
                <form onSubmit={handleSendMessage} className="relative">
                    <Input 
                        placeholder="Ask Veda anything..."
                        value={inputValue}
                        onChange={e => setInputValue(e.target.value)}
                        className="pr-12"
                    />
                    <Button type="submit" size="icon" variant="ghost" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8">
                        <Send className="h-4 w-4" />
                    </Button>
                </form>
            </div>
        )}
    </div>
  );
}
