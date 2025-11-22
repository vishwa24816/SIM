
'use client';
import {
    Settings,
    Clock,
    Webhook,
    Database,
    GitBranch,
    Calculator,
    BringToFront,
    GitCompareArrows,
    HandCoins,
    CircleDollarSign,
    CandlestickChart,
    BookOpen,
    History,
    Receipt,
    ListOrdered,
    Shield,
    FileTerminal,
    ShoppingCart,
    Package,
    TrendingUp,
} from 'lucide-react';
import { NodeProps } from 'reactflow';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';

export const DRAGGABLE_TYPE = 'application/reactflow-node';

const CustomNode = ({ data }: NodeProps<any>) => {
    const Icon = data.icon || Settings;
    return (
        <Card className="w-64 border-2 border-primary/50 shadow-lg">
            <CardHeader className="p-3">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-muted rounded-md">
                        <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <CardTitle className="text-base">{data.label}</CardTitle>
                        <p className="text-xs text-muted-foreground">{data.category}</p>
                    </div>
                </div>
            </CardHeader>
        </Card>
    );
};

export const nodeTypes = {
  trigger: (props: NodeProps) => <CustomNode {...props} />,
  marketData: (props: NodeProps) => <CustomNode {...props} />,
  indicator: (props: NodeProps) => <CustomNode {...props} />,
  arbitrage: (props: NodeProps) => <CustomNode {...props} />,
  trading: (props: NodeProps) => <CustomNode {...props} />,
  basket: (props: NodeProps) => <CustomNode {...props} />,
  logic: (props: NodeProps) => <CustomNode {...props} />,
  risk: (props: NodeProps) => <CustomNode {...props} />,
  utility: (props: NodeProps) => <CustomNode {...props} />,
};

export const initialNodes = [
  {
    id: '1',
    type: 'trigger',
    position: { x: 100, y: 150 },
    data: { label: 'On a Schedule', icon: Clock, category: 'Triggers' },
  },
];

export const nodeCategories = [
    { 
        title: 'Market Data Nodes',
        nodes: [
            { type: 'marketData', label: 'Get Ticker Price', icon: CircleDollarSign },
            { type: 'marketData', label: 'Get Order Book', icon: BookOpen },
            { type: 'marketData', label: 'Get Funding Rate', icon: Receipt },
            { type: 'marketData', label: 'Get OHLC Data', icon: CandlestickChart },
            { type: 'marketData', label: 'Get Historical Trades', icon: History },
        ]
    },
    {
        title: 'Indicator Nodes',
        nodes: [
            { type: 'indicator', label: 'SMA / EMA', icon: Calculator, description: 'Configurable length' },
            { type: 'indicator', label: 'RSI', icon: Calculator, description: 'Momentum or reversal setups' },
            { type: 'indicator', label: 'MACD', icon: Calculator },
            { type: 'indicator', label: 'Bollinger Bands', icon: Calculator },
            { type: 'indicator', label: 'ATR', icon: Calculator },
            { type: 'indicator', label: 'Supertrend', icon: Calculator },
            { type: 'indicator', label: 'Trend Strength', icon: TrendingUp, description: 'Simple direction score' },
        ]
    },
    {
        title: 'Trading Nodes',
        nodes: [
            { type: 'trading', label: 'Place Market Order', icon: HandCoins },
            { type: 'trading', label: 'Place Limit Order', icon: HandCoins },
            { type: 'trading', label: 'Cancel Order', icon: HandCoins },
            { type: 'trading', label: 'Fetch Open Orders', icon: ListOrdered },
        ]
    },
    {
        title: 'Basket Strategy Nodes',
        nodes: [
            { type: 'basket', label: 'Create Basket', icon: ShoppingCart },
            { type: 'basket', label: 'Execute Basket', icon: Package },
        ]
    },
    {
        title: 'Core Logic & Control Nodes',
        nodes: [
            { type: 'trigger', label: 'On a Schedule', icon: Clock },
            { type: 'trigger', label: 'Webhook', icon: Webhook },
            { type: 'logic', label: 'If/Else', icon: GitBranch },
            { type: 'logic', label: 'Math Operation', icon: Calculator },
            { type: 'logic', label: 'Compare Values', icon: GitCompareArrows },
            { type: 'logic', label: 'Boolean Logic', icon: GitBranch },
        ]
    },
    {
        title: 'Risk / Guardrail Nodes',
        nodes: [
            { type: 'risk', label: 'Stop Loss', icon: Shield },
            { type: 'risk', label: 'Take Profit', icon: Shield },
            { type: 'risk', label: 'Trailing Stop', icon: Shield },
        ]
    },
     {
        title: 'Utility Nodes',
        nodes: [
            { type: 'utility', label: 'Set Variable', icon: BringToFront },
            { type: 'utility', label: 'Get Variable', icon: Database },
            { type: 'utility', label: 'Log to Console', icon: FileTerminal },
        ]
    }
];
