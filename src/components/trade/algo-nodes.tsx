
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
    Trash2,
    Scaling,
} from 'lucide-react';
import { NodeProps, Handle, Position } from 'reactflow';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

const CustomNode = ({ data, id }: NodeProps<any>) => {
    const Icon = data.icon || Settings;
    const isStart = data.label === 'Start';
    const isStop = data.label === 'Stop';
    
    const handleDelete = () => {
        if (data.onDelete) {
            data.onDelete(id);
        }
    }

    return (
        <Card className="w-64 border-2 border-primary/50 shadow-lg group">
            {!isStart && <Handle type="target" position={Position.Left} className="!bg-primary" />}
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
            {!isStop && <Handle type="source" position={Position.Right} className="!bg-primary" />}

            {!isStart && (
                <Button 
                    variant="destructive"
                    size="icon"
                    className="absolute -top-3 -right-3 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={handleDelete}
                >
                    <Trash2 className="h-3 w-3" />
                </Button>
            )}
        </Card>
    );
};

export const SidebarNode = ({ nodeType, label, icon: Icon, category, onNodeClick }: { nodeType: string; label: string; icon: React.ElementType; category: string; onNodeClick: () => void; }) => {
    return (
        <div
            className="p-2 border rounded-md cursor-pointer bg-card hover:bg-muted"
            onClick={onNodeClick}
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

export const initialNodes: Node[] = [
  {
    id: '1',
    type: 'trigger',
    position: { x: 100, y: 150 },
    data: { 
        label: 'Start', 
        icon: PlayCircle, 
        category: 'Core Logic & Control Nodes',
        onDelete: () => {}, // No-op for start node
    },
  },
];

export const nodeCategories = [
    { 
        title: 'Market Data Nodes',
        nodes: [
            { nodeType: 'marketData', label: 'Get Ticker Price', icon: CircleDollarSign, category: 'Market Data Nodes' },
            { nodeType: 'marketData', label: 'Get Order Book', icon: BookOpen, category: 'Market Data Nodes' },
            { nodeType: 'marketData', label: 'Get Funding Rate', icon: Receipt, category: 'Market Data Nodes' },
            { nodeType: 'marketData', label: 'Get OHLC Data', icon: CandlestickChart, category: 'Market Data Nodes' },
            { nodeType: 'marketData', label: 'Get Historical Trades', icon: History, category: 'Market Data Nodes' },
        ]
    },
    {
        title: 'Indicator Nodes',
        nodes: [
            { nodeType: 'indicator', label: 'SMA / EMA', icon: Calculator, description: 'Configurable length', category: 'Indicator Nodes' },
            { nodeType: 'indicator', label: 'RSI', icon: Calculator, description: 'Momentum or reversal setups', category: 'Indicator Nodes' },
            { nodeType: 'indicator', label: 'MACD', icon: Calculator, category: 'Indicator Nodes' },
            { nodeType: 'indicator', label: 'Bollinger Bands', icon: Calculator, category: 'Indicator Nodes' },
            { nodeType: 'indicator', label: 'ATR', icon: Calculator, category: 'Indicator Nodes' },
            { nodeType: 'indicator', label: 'Supertrend', icon: Calculator, category: 'Indicator Nodes' },
            { nodeType: 'indicator', label: 'Trend Strength', icon: TrendingUp, description: 'Simple direction score', category: 'Indicator Nodes' },
        ]
    },
    {
        title: 'Trading Nodes',
        nodes: [
            { nodeType: 'trading', label: 'Place Market Order', icon: HandCoins, category: 'Trading Nodes' },
            { nodeType: 'trading', label: 'Place Limit Order', icon: HandCoins, category: 'Trading Nodes' },
            { nodeType: 'trading', label: 'Place HODL Order', icon: HandCoins, category: 'Trading Nodes' },
            { nodeType: 'trading', label: 'Cancel Order', icon: HandCoins, category: 'Trading Nodes' },
            { nodeType: 'trading', label: 'Fetch Open Orders', icon: ListOrdered, category: 'Trading Nodes' },
            { nodeType: 'trading', label: 'Set Leverage', icon: Scaling, category: 'Trading Nodes' },
            { nodeType: 'trading', label: 'Add to Position', icon: PlusCircle, category: 'Trading Nodes' },
            { nodeType: 'trading', label: 'Reduce Position', icon: MinusCircle, category: 'Trading Nodes' },
            { nodeType: 'trading', label: 'Square Off Position', icon: XCircle, category: 'Trading Nodes' },
        ]
    },
    {
        title: 'Basket Strategy Nodes',
        nodes: [
            { nodeType: 'basket', label: 'Add to Basket', icon: PlusCircle, category: 'Basket Strategy Nodes' },
            { nodeType: 'basket', label: 'Remove from Basket', icon: MinusCircle, category: 'Basket Strategy Nodes' },
            { nodeType: 'basket', label: 'Close Basket', icon: XCircle, category: 'Basket Strategy Nodes' },
            { nodeType: 'basket', label: 'Execute Basket', icon: ShoppingCart, category: 'Basket Strategy Nodes' },
        ]
    },
    {
        title: 'Core Logic & Control Nodes',
        nodes: [
            { nodeType: 'trigger', label: 'Start', icon: PlayCircle, category: 'Core Logic & Control Nodes' },
            { nodeType: 'trigger', label: 'Stop', icon: StopCircle, category: 'Core Logic & Control Nodes' },
            { nodeType: 'trigger', label: 'On a Schedule', icon: Clock, category: 'Core Logic & Control Nodes' },
            { nodeType: 'trigger', label: 'Webhook', icon: Webhook, category: 'Core Logic & Control Nodes' },
            { nodeType: 'logic', label: 'If/Else', icon: GitBranch, category: 'Core Logic & Control Nodes' },
            { nodeType: 'logic', label: 'Math Operation', icon: Calculator, category: 'Core Logic & Control Nodes' },
            { nodeType: 'logic', label: 'Compare Values', icon: GitCompareArrows, category: 'Core Logic & Control Nodes' },
            { nodeType: 'logic', label: 'Boolean Logic', icon: GitBranch, category: 'Core Logic & Control Nodes' },
        ]
    },
    {
        title: 'Risk / Guardrail Nodes',
        nodes: [
            { nodeType: 'risk', label: 'Stop Loss', icon: Shield, category: 'Risk / Guardrail Nodes' },
            { nodeType: 'risk', label: 'Take Profit', icon: Shield, category: 'Risk / Guardrail Nodes' },
            { nodeType: 'risk', label: 'Trailing Stop', icon: Shield, category: 'Risk / Guardrail Nodes' },
        ]
    },
     {
        title: 'Utility Nodes',
        nodes: [
            { nodeType: 'utility', label: 'Set Variable', icon: BringToFront, category: 'Utility Nodes' },
            { nodeType: 'utility', label: 'Get Variable', icon: Database, category: 'Utility Nodes' },
            { nodeType: 'utility', label: 'Log to Console', icon: FileTerminal, category: 'Utility Nodes' },
        ]
    }
];
