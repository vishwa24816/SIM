
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
    PlusCircle,
    MinusCircle,
    XCircle,
    PlayCircle,
    StopCircle,
} from 'lucide-react';
import { NodeProps } from 'reactflow';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';

export const DRAGGABLE_TYPE = 'application/reactflow';

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

export const SidebarNode = ({ nodeType, label, icon: Icon, category }: { nodeType: string; label: string; icon: React.ElementType; category: string }) => {
    const onDragStart = (event: React.DragEvent, nodeType: string) => {
        const data = JSON.stringify({ label, icon: nodeType, category });
        event.dataTransfer.setData(DRAGGABLE_TYPE, nodeType);
        event.dataTransfer.setData('application/reactflow-data', data);
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <div
            className="p-2 border rounded-md cursor-grab bg-card hover:bg-muted"
            onDragStart={(event) => onDragStart(event, nodeType)}
            draggable
        >
            <div className="flex items-center gap-2">
                <Icon className="w-4 h-4 text-primary" />
                <span className="text-sm">{label}</span>
            </div>
        </div>
    );
};


export const nodeTypes = {
  trigger: (props: NodeProps) => <CustomNode {...props} />,
  marketData: (props: NodeProps) => <CustomNode {...props} />,
  indicator: (props: NodeProps) => <CustomNode {...props} />,
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
    data: { label: 'Start', icon: PlayCircle, category: 'Core Logic & Control Nodes' },
  },
];

export const nodeCategories = [
    { 
        title: 'Market Data Nodes',
        nodes: [
            { nodeType: 'marketData', label: 'Get Ticker Price', icon: CircleDollarSign },
            { nodeType: 'marketData', label: 'Get Order Book', icon: BookOpen },
            { nodeType: 'marketData', label: 'Get Funding Rate', icon: Receipt },
            { nodeType: 'marketData', label: 'Get OHLC Data', icon: CandlestickChart },
            { nodeType: 'marketData', label: 'Get Historical Trades', icon: History },
        ]
    },
    {
        title: 'Indicator Nodes',
        nodes: [
            { nodeType: 'indicator', label: 'SMA / EMA', icon: Calculator, description: 'Configurable length' },
            { nodeType: 'indicator', label: 'RSI', icon: Calculator, description: 'Momentum or reversal setups' },
            { nodeType: 'indicator', label: 'MACD', icon: Calculator },
            { nodeType: 'indicator', label: 'Bollinger Bands', icon: Calculator },
            { nodeType: 'indicator', label: 'ATR', icon: Calculator },
            { nodeType: 'indicator', label: 'Supertrend', icon: Calculator },
            { nodeType: 'indicator', label: 'Trend Strength', icon: TrendingUp, description: 'Simple direction score' },
        ]
    },
    {
        title: 'Trading Nodes',
        nodes: [
            { nodeType: 'trading', label: 'Place Market Order', icon: HandCoins },
            { nodeType: 'trading', label: 'Place Limit Order', icon: HandCoins },
            { nodeType: 'trading', label: 'Place HODL Order', icon: HandCoins },
            { nodeType: 'trading', label: 'Cancel Order', icon: HandCoins },
            { nodeType: 'trading', label: 'Fetch Open Orders', icon: ListOrdered },
            { nodeType: 'trading', label: 'Add to Position', icon: PlusCircle },
            { nodeType: 'trading', label: 'Reduce Position', icon: MinusCircle },
            { nodeType: 'trading', label: 'Square Off Position', icon: XCircle },
        ]
    },
    {
        title: 'Basket Strategy Nodes',
        nodes: [
            { nodeType: 'basket', label: 'Add to Basket', icon: PlusCircle },
            { nodeType: 'basket', label: 'Remove from Basket', icon: MinusCircle },
            { nodeType: 'basket', label: 'Close Basket', icon: XCircle },
        ]
    },
    {
        title: 'Core Logic & Control Nodes',
        nodes: [
            { nodeType: 'trigger', label: 'Start', icon: PlayCircle },
            { nodeType: 'trigger', label: 'Stop', icon: StopCircle },
            { nodeType: 'trigger', label: 'On a Schedule', icon: Clock },
            { nodeType: 'trigger', label: 'Webhook', icon: Webhook },
            { nodeType: 'logic', label: 'If/Else', icon: GitBranch },
            { nodeType: 'logic', label: 'Math Operation', icon: Calculator },
            { nodeType: 'logic', label: 'Compare Values', icon: GitCompareArrows },
            { nodeType: 'logic', label: 'Boolean Logic', icon: GitBranch },
        ]
    },
    {
        title: 'Risk / Guardrail Nodes',
        nodes: [
            { nodeType: 'risk', label: 'Stop Loss', icon: Shield },
            { nodeType: 'risk', label: 'Take Profit', icon: Shield },
            { nodeType: 'risk', label: 'Trailing Stop', icon: Shield },
        ]
    },
     {
        title: 'Utility Nodes',
        nodes: [
            { nodeType: 'utility', label: 'Set Variable', icon: BringToFront },
            { nodeType: 'utility', label: 'Get Variable', icon: Database },
            { nodeType: 'utility', label: 'Log to Console', icon: FileTerminal },
        ]
    }
];
