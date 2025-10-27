
'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Upload, Plus, Cpu, ZoomIn, ZoomOut, Move } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

const StartNode = () => {
    return (
        <Card className="w-48 shadow-lg bg-primary text-primary-foreground">
            <CardHeader className="p-3">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Cpu className="w-4 h-4" />
                    Start
                </CardTitle>
            </CardHeader>
        </Card>
    );
}

const AssetNode = () => {
    return (
        <Card className="w-64 shadow-lg">
             <CardHeader className="p-3">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    Assets
                </CardTitle>
            </CardHeader>
            <CardContent className="p-3">
                <Button variant="ghost" className="w-full justify-start">
                    <Plus className="w-4 h-4 mr-2" /> Add Asset
                </Button>
            </CardContent>
        </Card>
    );
}


export default function NoCodeAlgoPage() {
  const router = useRouter();
  const [nodes, setNodes] = React.useState([
    { id: 'start', component: <StartNode />, position: { x: 50, y: 200 } },
    { id: 'asset1', component: <AssetNode />, position: { x: 350, y: 200 } }
  ]);

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-xl font-bold">No-Code Strategy Builder</h1>
            <div className="ml-auto flex items-center gap-2">
                <Button variant="outline">
                    <Save className="h-4 w-4 mr-2" />
                    Save Strategy
                </Button>
                <Button>
                    <Upload className="h-4 w-4 mr-2" />
                    Deploy Strategy
                </Button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-1 relative overflow-hidden dot-grid">
         {nodes.map(node => (
             <motion.div
                key={node.id}
                drag
                dragMomentum={false}
                className="absolute cursor-grab active:cursor-grabbing"
                style={{
                    left: node.position.x,
                    top: node.position.y
                }}
             >
                {node.component}
            </motion.div>
         ))}

        <div className="absolute bottom-4 right-4 flex items-center gap-2">
            <Button variant="outline" size="icon"><ZoomIn className="h-4 w-4"/></Button>
            <Button variant="outline" size="icon"><ZoomOut className="h-4 w-4"/></Button>
            <Button variant="outline" size="icon"><Move className="h-4 w-4"/></Button>
        </div>
      </main>
    </div>
  );
}
