
'use client';

import * as React from 'react';
import { ArrowLeft, Play, Save, Trash2, GitBranch, Plus, Menu, ZoomIn, ZoomOut, Lock, Unlock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { Clock } from 'lucide-react';
import { ArrowDown } from 'lucide-react';
import { GripVertical } from 'lucide-react';

const SidebarNode = ({ icon: Icon, title, color }: { icon: React.ElementType; title: string; color: string }) => (
    <div className="flex items-center gap-3 p-3 rounded-lg border bg-card cursor-grab active:cursor-grabbing">
        <GripVertical className="w-5 h-5 text-muted-foreground" />
        <Icon className={cn('w-5 h-5', `text-${color}-500`)} />
        <span className="font-medium">{title}</span>
    </div>
);


export default function NoCodeAlgoPage() {
    const router = useRouter();
    const [zoom, setZoom] = React.useState(100);
    const [isLocked, setIsLocked] = React.useState(false);

    const handleZoomIn = () => setZoom(z => Math.min(z + 10, 200));
    const handleZoomOut = () => setZoom(z => Math.max(z - 10, 30));

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
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="outline" size="icon" className="ml-2">
                                        <Menu className="h-5 w-5" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent>
                                    <SheetHeader>
                                        <SheetTitle>Nodes</SheetTitle>
                                    </SheetHeader>
                                    <div className="py-4 space-y-3">
                                        <p className="text-sm font-semibold text-muted-foreground">Triggers</p>
                                        <SidebarNode icon={Clock} title="On a Schedule" color="blue" />
                                        <p className="text-sm font-semibold text-muted-foreground pt-4">Logic</p>
                                        <SidebarNode icon={GitBranch} title="If / Else" color="yellow" />
                                        <p className="text-sm font-semibold text-muted-foreground pt-4">Actions</p>
                                        <SidebarNode icon={ArrowDown} title="Buy" color="green" />
                                        <SidebarNode icon={ArrowDown} title="Sell" color="red" />
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1 p-8 overflow-hidden relative">
                <div 
                    className="flex flex-col items-center justify-center min-h-full transition-transform duration-200"
                    style={{ transform: `scale(${zoom / 100})` }}
                >
                    <div className="text-center text-muted-foreground">
                        <p>Drag and drop nodes from the panel to start building your algorithm.</p>
                    </div>
                </div>

                <div className="absolute bottom-4 right-4 flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={handleZoomOut}>
                        <ZoomOut className="h-5 w-5" />
                    </Button>
                    <span className="text-sm font-medium w-12 text-center">{zoom}%</span>
                    <Button variant="outline" size="icon" onClick={handleZoomIn}>
                        <ZoomIn className="h-5 w-5" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => setIsLocked(!isLocked)}>
                        {isLocked ? <Lock className="h-5 w-5" /> : <Unlock className="h-5 w-5" />}
                    </Button>
                </div>
            </main>
        </div>
    );
}
