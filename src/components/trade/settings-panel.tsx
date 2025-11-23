
'use client';

import * as React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Node } from 'reactflow';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

interface SettingsPanelProps {
    selectedNode: Node | null;
    setSelectedNode: (node: Node | null) => void;
}

const RsiSettings = ({ node }: { node: Node }) => {
    return (
        <div className="space-y-4">
            <div>
                <Label htmlFor="rsi-period">Period</Label>
                <Input id="rsi-period" defaultValue={node.data.period || 14} />
            </div>
             <div>
                <Label htmlFor="rsi-overbought">Overbought Level</Label>
                <Input id="rsi-overbought" defaultValue={node.data.overbought || 70} />
            </div>
             <div>
                <Label htmlFor="rsi-oversold">Oversold Level</Label>
                <Input id="rsi-oversold" defaultValue={node.data.oversold || 30} />
            </div>
            <Button className="w-full">Apply</Button>
        </div>
    );
}

const renderSettings = (node: Node | null) => {
    if (!node) return null;
    
    switch (node.type) {
        case 'indicator':
            if (node.data.label === 'RSI') {
                return <RsiSettings node={node} />;
            }
            // Add other indicator settings here
            return <p>Settings for {node.data.label} will be available soon.</p>;
        default:
            return <p>No configurable settings for this node type.</p>;
    }
}

export function SettingsPanel({ selectedNode, setSelectedNode }: SettingsPanelProps) {
    const isPanelOpen = selectedNode !== null;

    return (
        <Sheet open={isPanelOpen} onOpenChange={(open) => !open && setSelectedNode(null)}>
            <SheetContent side="right">
                <SheetHeader>
                    <SheetTitle>{selectedNode?.data.label || 'Settings'}</SheetTitle>
                    <SheetDescription>
                        Configure the parameters for your selected node.
                    </SheetDescription>
                </SheetHeader>
                <div className="py-4">
                    {renderSettings(selectedNode)}
                </div>
            </SheetContent>
        </Sheet>
    );
}
