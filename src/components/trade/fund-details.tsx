
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MutualFund } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Info, User, List, Briefcase } from 'lucide-react';

interface FundDetailsProps {
    fund: MutualFund;
}

export function FundDetails({ fund }: FundDetailsProps) {
    const [activeTab, setActiveTab] = React.useState('About Fund');
    const tabs = ['About Fund', 'Calculator', 'Rankings'];

    return (
        <div>
            <div className="border-b border-border">
                <div className="overflow-x-auto px-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground whitespace-nowrap">
                        {tabs.map(tab => (
                            <Button
                                key={tab}
                                variant="ghost"
                                size="sm"
                                onClick={() => setActiveTab(tab)}
                                className={cn("px-3", activeTab === tab && 'text-primary')}
                            >
                                {tab}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="p-4 space-y-6">
                {activeTab === 'About Fund' && (
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <Info className="w-5 h-5 text-primary" />
                                    <CardTitle className="text-lg">About the Fund</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">{fund.about}</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <User className="w-5 h-5 text-primary" />
                                    <CardTitle className="text-lg">Fund Management</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-4">
                                    <Avatar className="w-16 h-16">
                                        <AvatarFallback>{fund.fundManager.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold">{fund.fundManager.name}</p>
                                        <p className="text-sm text-muted-foreground">{fund.fundManager.title}</p>
                                        <p className="text-xs text-muted-foreground">{fund.fundManager.company}</p>
                                    </div>
                                </div>
                                <p className="text-sm text-muted-foreground mt-4">{fund.fundManager.bio}</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <Briefcase className="w-5 h-5 text-primary" />
                                    <CardTitle className="text-lg">Top Holdings ({fund.topHoldings.length})</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-3">
                                    {fund.topHoldings.map(holding => (
                                        <li key={holding.name} className="flex justify-between items-center text-sm">
                                            <span>{holding.name} ({holding.symbol})</span>
                                            <span className="font-medium">{holding.percentage.toFixed(2)}%</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                )}
                {activeTab !== 'About Fund' && (
                    <div className="flex items-center justify-center h-48 bg-muted rounded-lg">
                        <p className="text-muted-foreground">Content for {activeTab} coming soon.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
