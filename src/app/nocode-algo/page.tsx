
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Play, Save, Trash2, GitBranch, Plus, Menu, ZoomIn, ZoomOut, Lock, Unlock, MoreHorizontal, Clock, ShoppingCart, AlertTriangle, ArrowDown, ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import './nocode-algo.css';


const NODE_TYPES = {
  TRIGGER: { icon: Clock, title: 'Trigger', subtitle: 'On a Schedule', bg: 'bg-blue-500/10', iconBg: 'bg-blue-500/20 text-blue-500' },
  LOGIC: { icon: GitBranch, title: 'Logic', subtitle: 'If / Else', bg: 'bg-yellow-500/10', iconBg: 'bg-yellow-500/20 text-yellow-500' },
  BUY_ACTION: { icon: ArrowUp, title: 'Action', subtitle: 'Buy', bg: 'bg-green-500/10', iconBg: 'bg-green-500/20 text-green-500' },
  SELL_ACTION: { icon: ArrowDown, title: 'Action', subtitle: 'Sell', bg: 'bg-red-500/10', iconBg: 'bg-red-500/20 text-red-500' },
};

interface Node {
  id: string;
  type: keyof typeof NODE_TYPES;
  position: { x: number; y: number };
  children: Node[];
}

const NodeComponent = ({ node, onAddNode }: { node: Node; onAddNode: (parentId: string, type: keyof typeof NODE_TYPES) => void; }) => {
  const nodeInfo = NODE_TYPES[node.type];

  return (
    <div className="flex flex-col items-center">
      <div className={`node-card ${nodeInfo.bg}`}>
        <div className="node-header">
          <div className={`node-icon ${nodeInfo.iconBg}`}>
            <nodeInfo.icon className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="node-title">{nodeInfo.title}</p>
            <p className="node-subtitle">{nodeInfo.subtitle}</p>
          </div>
          <Button variant="ghost" size="icon" className="node-more-button">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
        <div className="node-content">
          {node.type === 'LOGIC' && (
            <div className="flex justify-around text-xs font-semibold text-muted-foreground">
              <span>TRUE</span>
              <span>FALSE</span>
            </div>
          )}
        </div>
      </div>

      <div className="h-8 w-px bg-border my-2" />

      {node.children.length === 0 ? (
        node.type === 'LOGIC' ? (
           <div className="flex gap-16">
                <AddNodeButton parentId={node.id} onAddNode={onAddNode} isBranch={true} />
                <AddNodeButton parentId={node.id} onAddNode={onAddNode} isBranch={true} />
           </div>
        ) : (
            <AddNodeButton parentId={node.id} onAddNode={onAddNode} />
        )
      ) : (
        <div className="flex gap-8">
          {node.children.map(child => (
            <NodeComponent key={child.id} node={child} onAddNode={onAddNode} />
          ))}
        </div>
      )}
    </div>
  );
};


const AddNodeButton = ({ parentId, onAddNode, isBranch = false }: { parentId: string; onAddNode: (parentId: string, type: keyof typeof NODE_TYPES) => void; isBranch?: boolean}) => (
    <Popover>
        <PopoverTrigger asChild>
             <Button variant="outline" className={cn("add-node-button", isBranch && "w-16")}>
                <Plus className="w-5 h-5" />
            </Button>
        </PopoverTrigger>
        <PopoverContent className="w-60 p-2">
            <div className="space-y-1">
                 <p className="p-2 text-xs font-semibold text-muted-foreground">Logic</p>
                 <NodeMenuItem icon={GitBranch} title="If / Else" onClick={() => onAddNode(parentId, 'LOGIC')} />
                 <p className="p-2 text-xs font-semibold text-muted-foreground">Actions</p>
                 <NodeMenuItem icon={ArrowUp} title="Buy" onClick={() => onAddNode(parentId, 'BUY_ACTION')} />
                 <NodeMenuItem icon={ArrowDown} title="Sell" onClick={() => onAddNode(parentId, 'SELL_ACTION')} />
            </div>
        </PopoverContent>
    </Popover>
);

const NodeMenuItem = ({ icon: Icon, title, onClick }: { icon: React.ElementType, title: string, onClick: () => void }) => (
    <Button variant="ghost" className="w-full justify-start gap-2" onClick={onClick}>
        <Icon className="w-4 h-4" />
        <span>{title}</span>
    </Button>
);


export default function NoCodeAlgoPage() {
    const router = useRouter();
    const [zoom, setZoom] = React.useState(100);
    const [isLocked, setIsLocked] = React.useState(false);
    const [nodes, setNodes] = React.useState<Node>({ id: 'start', type: 'TRIGGER', position: { x: 0, y: 0 }, children: [] });

    const handleAddNode = (parentId: string, type: keyof typeof NODE_TYPES) => {
        const newNode: Node = { id: `node_${Date.now()}`, type, position: { x: 0, y: 0 }, children: [] };
        
        const addNodeToTree = (root: Node): Node => {
            if (root.id === parentId) {
                return { ...root, children: [...root.children, newNode] };
            }
            return { ...root, children: root.children.map(addNodeToTree) };
        };
        
        setNodes(addNodeToTree(nodes));
    };


    const handleZoomIn = () => setZoom(z => Math.min(z + 10, 150));
    const handleZoomOut = () => setZoom(z => Math.max(z - 10, 50));

    return (
        <div className="bg-background min-h-screen flex flex-col">
            <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center h-16 gap-4">
                        <Button variant="ghost" size="icon" onClick={() => router.back()}>
                            <ArrowLeft className="h-6 w-6" />
                        </Button>
                        <h1 className="text-xl font-bold">New Algorithm</h1>
                        <div className="ml-auto flex items-center gap-2">
                            <Button variant="outline"><Trash2 className="w-4 h-4 mr-2" /> Clear</Button>
                            <Button variant="outline"><Save className="w-4 h-4 mr-2" /> Save</Button>
                            <Button><Play className="w-4 h-4 mr-2" /> Run Backtest</Button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1 overflow-hidden relative">
                <div className="algo-canvas">
                    <div className="algo-canvas-zoom" style={{ transform: `scale(${zoom / 100})` }}>
                        <NodeComponent node={nodes} onAddNode={handleAddNode} />
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
