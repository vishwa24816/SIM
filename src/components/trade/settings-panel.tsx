
'use client';

import * as React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Node } from 'reactflow';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

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

const IfElseSettings = ({ node }: { node: Node }) => {
    return (
        <div className="space-y-4">
            <div>
                <Label htmlFor="logic-type">Logic Type</Label>
                <Select defaultValue={node.data.logicType || 'if'}>
                    <SelectTrigger id="logic-type">
                        <SelectValue placeholder="Select logic type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="if">If</SelectItem>
                        <SelectItem value="else-if">Else If</SelectItem>
                        <SelectItem value="else">Else</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <p className="text-sm text-muted-foreground">Define your condition in the connected nodes.</p>
            <Button className="w-full">Apply</Button>
        </div>
    )
}

const MathOpSettings = ({ node }: { node: Node }) => {
     return (
        <div className="space-y-4">
            <div>
                <Label htmlFor="math-operator">Operator</Label>
                <Select defaultValue={node.data.operator || 'add'}>
                    <SelectTrigger id="math-operator">
                        <SelectValue placeholder="Select an operator" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="add">Addition (+)</SelectItem>
                        <SelectItem value="subtract">Subtraction (-)</SelectItem>
                        <SelectItem value="multiply">Multiplication (*)</SelectItem>
                        <SelectItem value="divide">Division (/)</SelectItem>
                        <SelectItem value="modulo">Modulo (%)</SelectItem>
                    </SelectContent>
                </Select>
            </div>
             <p className="text-sm text-muted-foreground">Provide input values from other nodes.</p>
            <Button className="w-full">Apply</Button>
        </div>
    )
}


const renderSettings = (node: Node | null) => {
    if (!node) return null;
    
    switch (node.data.label) {
        case 'RSI':
            return <RsiSettings node={node} />;
        case 'If/Else':
            return <IfElseSettings node={node} />;
        case 'Math Operation':
            return <MathOpSettings node={node} />;
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
