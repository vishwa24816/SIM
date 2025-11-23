
'use client';

import * as React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Node } from 'reactflow';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { spotPairs, futuresPairs } from '@/lib/pairs';

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

const RiskGuardrailSetting = ({ label, node }: { label: string, node: Node }) => {
    const [value, setValue] = React.useState(node.data.value || '');
    const [type, setType] = React.useState<'price' | 'percentage'>(node.data.type || 'price');

    return (
        <div className="space-y-4">
            <Label>{label}</Label>
             <div className="flex gap-2">
                <Input placeholder="0.00" type="number" value={value} onChange={e => setValue(e.target.value)} />
                <div className="flex rounded-md bg-muted p-1">
                    <Button variant={type === 'price' ? 'default' : 'ghost'} size="sm" onClick={() => setType('price')} className="flex-1 text-xs px-2 h-auto data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">$</Button>
                    <Button variant={type === 'percentage' ? 'default' : 'ghost'} size="sm" onClick={() => setType('percentage')} className="flex-1 text-xs px-2 h-auto data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">%</Button>
                </div>
            </div>
            <Button className="w-full">Apply</Button>
        </div>
    );
};

const TrailingStopSettings = ({ node }: { node: Node }) => {
    const [value, setValue] = React.useState(node.data.value || '');
    return (
        <div className="space-y-4">
            <Label>Trailing Stop</Label>
             <div className="flex gap-2">
                <Input placeholder="e.g., 2" type="number" value={value} onChange={e => setValue(e.target.value)} />
                <div className="flex items-center px-3 rounded-md bg-muted text-sm">%</div>
            </div>
            <Button className="w-full">Apply</Button>
        </div>
    );
};

const GetTickerPriceSettings = ({ node }: { node: Node }) => {
    const [marketType, setMarketType] = React.useState(node.data.marketType || 'spot');
    const [ticker, setTicker] = React.useState(node.data.ticker || '');

    const tickers = marketType === 'spot' ? spotPairs : futuresPairs;

    return (
        <div className="space-y-4">
            <div>
                <Label htmlFor="market-type">Market</Label>
                <Select value={marketType} onValueChange={setMarketType}>
                    <SelectTrigger id="market-type">
                        <SelectValue placeholder="Select market type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="spot">Spot</SelectItem>
                        <SelectItem value="futures">Futures</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Label htmlFor="ticker">Ticker</Label>
                <Select value={ticker} onValueChange={setTicker}>
                    <SelectTrigger id="ticker">
                        <SelectValue placeholder="Select a ticker" />
                    </SelectTrigger>
                    <SelectContent>
                        {tickers.map(t => (
                            <SelectItem key={t.pair} value={t.pair}>{t.pair}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <Button className="w-full">Apply</Button>
        </div>
    );
};

const renderSettings = (node: Node | null) => {
    if (!node) return null;
    
    switch (node.data.label) {
        case 'Get Ticker Price':
            return <GetTickerPriceSettings node={node} />;
        case 'RSI':
            return <RsiSettings node={node} />;
        case 'If/Else':
            return <IfElseSettings node={node} />;
        case 'Math Operation':
            return <MathOpSettings node={node} />;
        case 'Stop Loss':
            return <RiskGuardrailSetting label="Stop Loss" node={node} />;
        case 'Take Profit':
            return <RiskGuardrailSetting label="Take Profit" node={node} />;
        case 'Trailing Stop':
            return <TrailingStopSettings node={node} />;
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
