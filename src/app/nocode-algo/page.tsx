
'use client';

import * as React from 'react';
import { ArrowLeft, Play, Save, Trash2, Clock, GitBranch, ArrowDown, Settings, GripVertical, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { Separator } from '@/components/ui/separator';

const DraggableNode = ({ icon: Icon, title, description, color, children, isConnector = false }: { icon: React.ElementType; title: string; description?: string; color: string; children?: React.ReactNode; isConnector?: boolean }) => (
    <div className={`relative ${isConnector ? 'w-full' : 'w-64'}`}>
        {!isConnector && (
            <Card className={`bg-${color}-500/10 border-${color}-500/50 shadow-md`}>
                <CardHeader className="flex flex-row items-center gap-4 p-4">
                    <div className={`p-2 bg-background rounded-lg`}>
                        <Icon className={`w-6 h-6 text-${color}-500`} />
                    </div>
                    <div>
                        <CardTitle className="text-base">{title}</CardTitle>
                        {description && <CardDescription className="text-xs">{description}</CardDescription>}
                    </div>
                    <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6">
                        <Settings className="w-4 h-4" />
                    </Button>
                </CardHeader>
                {children && (
                    <CardContent className="p-4 pt-0">
                        {children}
                    </CardContent>
                )}
            </Card>
        )}
        {isConnector && <div className="h-12 w-px bg-border mx-auto" />}
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-background border rounded-full flex items-center justify-center">
            <Plus className="w-4 h-4 text-muted-foreground" />
        </div>
    </div>
);

const SidebarNode = ({ icon: Icon, title, color }: { icon: React.ElementType; title: string; color: string }) => (
    <div className="flex items-center gap-3 p-3 rounded-lg border bg-card cursor-grab active:cursor-grabbing">
        <GripVertical className="w-5 h-5 text-muted-foreground" />
        <Icon className={`w-5 h-5 text-${color}-500`} />
        <span className="font-medium">{title}</span>
    </div>
);

export default function NoCodeAlgoPage() {
    const router = useRouter();

    return (
        <div className="bg-muted/40 min-h-screen flex flex-col">
            <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center h-16 gap-4">
                        <Button variant="ghost" size="icon" onClick={() => router.back()}>
                            <ArrowLeft className="h-6 w-6" />
                        </Button>
                        <h1 className="text-xl font-bold">Algo Builder</h1>
                        <div className="ml-auto flex items-center gap-2">
                            <Button variant="outline"><Trash2 className="w-4 h-4 mr-2" /> Clear</Button>
                            <Button variant="outline"><Save className="w-4 h-4 mr-2" /> Save</Button>
                            <Button><Play className="w-4 h-4 mr-2" /> Run Backtest</Button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex-1 flex">
                <aside className="w-80 bg-background border-r p-4 space-y-6">
                    <h2 className="text-lg font-semibold">Nodes</h2>
                    <div className="space-y-3">
                        <p className="text-sm font-semibold text-muted-foreground">Triggers</p>
                        <SidebarNode icon={Clock} title="On a Schedule" color="blue" />
                        <p className="text-sm font-semibold text-muted-foreground pt-4">Logic</p>
                        <SidebarNode icon={GitBranch} title="If / Else" color="yellow" />
                        <p className="text-sm font-semibold text-muted-foreground pt-4">Actions</p>
                        <SidebarNode icon={ArrowDown} title="Buy" color="green" />
                        <SidebarNode icon={ArrowDown} title="Sell" color="red" />
                    </div>
                </aside>

                <main className="flex-1 p-8 overflow-auto">
                    <div className="flex flex-col items-center gap-4">
                        <DraggableNode icon={Clock} title="Trigger: On a Schedule" description="Runs every 1 hour" color="blue" />
                        <DraggableNode icon={ArrowDown} title="" isConnector={true} color="gray" />
                        <DraggableNode icon={GitBranch} title="Condition: If/Else" color="yellow">
                            <p className="text-sm font-mono p-2 bg-muted rounded">BTC.price > 68000</p>
                        </DraggableNode>
                        <DraggableNode icon={ArrowDown} title="" isConnector={true} color="gray" />

                        <div className="flex gap-16">
                            <div className="flex flex-col items-center gap-4">
                               <div className="w-px h-8 bg-border" />
                                <div className="absolute -mt-4 text-xs bg-background px-2 text-muted-foreground">TRUE</div>
                                <DraggableNode icon={ArrowDown} title="Action: Buy" color="green">
                                    <p className="text-sm font-mono p-2 bg-muted rounded">Buy 0.5 BTC</p>
                                </DraggableNode>
                            </div>
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-px h-8 bg-border" />
                                <div className="absolute -mt-4 text-xs bg-background px-2 text-muted-foreground">FALSE</div>
                                <DraggableNode icon={ArrowDown} title="Action: Sell" color="red">
                                     <p className="text-sm font-mono p-2 bg-muted rounded">Sell 0.2 BTC</p>
                                </DraggableNode>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
