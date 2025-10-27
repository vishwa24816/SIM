
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Menu, Save, Play, Plus, Minus, Expand, Lock, Mic, Send, List as ListIcon, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';

const Handle = ({ position }: { position: 'left' | 'right' | 'top' | 'bottom' }) => {
    const baseClasses = "absolute w-3 h-3 rounded-full bg-background border-2 border-primary cursor-pointer";
    const positionClasses = {
        left: "left-0 top-1/2 -translate-x-1/2 -translate-y-1/2",
        right: "right-0 top-1/2 translate-x-1/2 -translate-y-1/2",
        top: "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2",
        bottom: "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2",
    };
    return <div className={`${baseClasses} ${positionClasses[position]}`} />;
};


const StartNode = () => {
    return (
        <Card className="w-64 border-2 border-green-500 shadow-lg cursor-grab active:cursor-grabbing relative">
            <Handle position="right" />
            <Handle position="left" />
            <CardContent className="p-3">
                <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                        <ListIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-semibold">Start</span>
                    </div>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                        <X className="h-4 w-4 text-red-500" />
                    </Button>
                </div>
                <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">Assets</p>
                    <Input readOnly value="NIFTY 50" className="h-8" />
                    <Button variant="outline" size="sm" className="w-full h-8">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Asset
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default function NoCodeAlgoPage() {
  const router = useRouter();
  const canvasRef = React.useRef<HTMLDivElement>(null);
  
  return (
      <div className="flex flex-col h-screen bg-background text-foreground font-sans">
        <header className="sticky top-0 z-30 flex items-center h-16 px-4 border-b bg-background/95 backdrop-blur-sm">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex-grow" />
            <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                <Save className="h-4 w-4 mr-2" />
                Save Strategy
                </Button>
                <Button size="sm">
                <Play className="h-4 w-4 mr-2" />
                Deploy Strategy
                </Button>
            </div>
        </header>

        <main ref={canvasRef} className="flex-1 relative dot-grid">
            <motion.div
                drag
                dragConstraints={canvasRef}
                className="absolute top-1/2 left-1/2"
            >
                <StartNode />
            </motion.div>

            <div className="absolute top-4 right-4 flex flex-col gap-2">
                <Button variant="outline" size="icon"><Plus className="h-4 w-4" /></Button>
                <Button variant="outline" size="icon"><Minus className="h-4 w-4" /></Button>
                <Button variant="outline" size="icon"><Expand className="h-4 w-4" /></Button>
                <Button variant="outline" size="icon"><Lock className="h-4 w-4" /></Button>
            </div>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-full max-w-lg px-4">
                <div className="relative">
                    <Input placeholder="Ask Simbot..." className="h-12 pl-4 pr-20 rounded-full shadow-lg" />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="rounded-full h-9 w-9">
                            <Mic className="h-5 w-5" />
                        </Button>
                         <Button size="icon" className="rounded-full h-9 w-9">
                            <Send className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </div>
        </main>
      </div>
  );
}
