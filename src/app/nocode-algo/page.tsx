
'use client';

import * as React from 'react';
import { ArrowLeft, Play, Eraser, Save, Menu as MenuIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function NoCodeAlgoPage() {
    const router = useRouter();

    return (
        <div className="flex flex-col h-screen bg-background text-foreground">
            <header className="flex-shrink-0 bg-card border-b">
                <div className="container mx-auto px-4">
                    <div className="flex items-center h-16 justify-between">
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="icon" onClick={() => router.back()}>
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                            <Button variant="ghost" size="icon">
                                <MenuIcon className="h-5 w-5" />
                            </Button>
                        </div>
                        <div className="flex items-center gap-2">
                             <Button variant="outline" size="sm">
                                <Eraser className="h-4 w-4 mr-2"/>
                                Clear
                            </Button>
                             <Button variant="outline" size="sm">
                                <Save className="h-4 w-4 mr-2"/>
                                Save
                            </Button>
                            <Button size="sm">
                                <Play className="h-4 w-4 mr-2"/>
                                Run
                            </Button>
                        </div>
                    </div>
                </div>
            </header>
            <main className="flex-1 flex items-center justify-center p-4">
                <div className="text-center text-muted-foreground">
                    <p>No-code Algo Builder coming soon!</p>
                </div>
            </main>
        </div>
    );
}
