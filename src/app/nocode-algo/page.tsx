
'use client';

import * as React from 'react';
import { 
    ArrowLeft, 
    Save, 
    Play, 
    Menu,
    History,
} from 'lucide-react';
import ReactFlow, {
  ReactFlowProvider,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Node,
  Edge,
  MarkerType,
  Connection,
  Controls,
  MiniMap,
  ReactFlowInstance,
  useOnSelectionChange,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { Button } from '@/components/ui/button';
import { initialNodes, nodeTypes as customNodeTypes, nodeCategories, SidebarNode } from '@/components/trade/algo-nodes';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useRouter } from 'next/navigation';
import { SettingsPanel } from '@/components/trade/settings-panel';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

const Flow = () => {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [reactFlowInstance, setReactFlowInstance] = React.useState<ReactFlowInstance | null>(null);
    const [selectedNode, setSelectedNode] = React.useState<Node | null>(null);

    useOnSelectionChange({
        onChange: ({ nodes }) => {
            setSelectedNode(nodes.length === 1 ? nodes[0] : null);
        },
    });

    const onConnect = React.useCallback(
        (params: Edge | Connection) => setEdges((eds) => addEdge({ ...params, type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } }, eds)),
        [setEdges]
    );

    const deleteNode = React.useCallback((nodeId: string) => {
        setNodes((nds) => nds.filter(n => n.id !== nodeId));
        setEdges((eds) => eds.filter(e => e.source !== nodeId && e.target !== nodeId));
    }, [setNodes, setEdges]);
    
    const addNode = (nodeData: { nodeType: string; label: string; icon: React.ElementType; category: string }) => {
        if (!reactFlowInstance) return;

        const position = reactFlowInstance.screenToFlowPosition({
            x: reactFlowInstance.getViewport().x + 250,
            y: reactFlowInstance.getViewport().y + 100,
        });

        const newNode: Node = {
            id: `${nodeData.nodeType}-${nodes.length + 1}`,
            type: nodeData.nodeType,
            position,
            data: { 
                label: nodeData.label, 
                icon: nodeData.icon, 
                category: nodeData.category,
                onDelete: deleteNode,
            },
        };

        setNodes((nds) => nds.concat(newNode));
    };

    const onEdgeDoubleClick = React.useCallback((event: React.MouseEvent, edge: Edge) => {
        setEdges((eds) => eds.filter((e) => e.id !== edge.id));
    }, [setEdges]);

    const savedStrategies = [
        { name: 'RSI Momentum Scalper' },
        { name: 'EMA Crossover Trend' },
        { name: 'Bollinger Breakout' },
    ];

    return (
        <div className="h-full w-full relative">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onInit={setReactFlowInstance}
                nodeTypes={customNodeTypes}
                onEdgeDoubleClick={onEdgeDoubleClick}
                fitView
                className="bg-background dot-grid"
            >
                <Background />
                <Controls />
                <MiniMap />
            </ReactFlow>
            <SettingsPanel selectedNode={selectedNode} setSelectedNode={setSelectedNode} />
             <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="absolute top-4 left-4 z-10">
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Open Nodes</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="flex flex-col p-0">
                    <SheetHeader className="p-4 border-b">
                        <SheetTitle>Builder Menu</SheetTitle>
                    </SheetHeader>
                    <ScrollArea className="flex-1">
                        <div className="p-4">
                             <Accordion type="multiple" className="w-full" defaultValue={['nodes', 'saved-strategies']}>
                                <AccordionItem value="nodes">
                                    <AccordionTrigger>Nodes</AccordionTrigger>
                                    <AccordionContent>
                                        <Accordion type="multiple" className="w-full">
                                            {nodeCategories.map(category => (
                                                <AccordionItem value={category.title} key={category.title}>
                                                    <AccordionTrigger>{category.title}</AccordionTrigger>
                                                    <AccordionContent>
                                                        <div className="space-y-2">
                                                            {category.nodes.map(node => (
                                                                <SidebarNode 
                                                                    key={node.label} 
                                                                    onNodeClick={() => addNode(node)}
                                                                    {...node} 
                                                                />
                                                            ))}
                                                        </div>
                                                    </AccordionContent>
                                                </AccordionItem>
                                            ))}
                                        </Accordion>
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="saved-strategies">
                                    <AccordionTrigger>Saved Strategies</AccordionTrigger>
                                    <AccordionContent>
                                        <div className="space-y-2">
                                            {savedStrategies.map(strategy => (
                                                <div key={strategy.name} className="flex items-center justify-between p-2 border rounded-md bg-card hover:bg-muted cursor-pointer">
                                                    <div className="flex items-center gap-2">
                                                        <History className="w-4 h-4 text-primary" />
                                                        <span className="text-sm">{strategy.name}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </div>
                    </ScrollArea>
                </SheetContent>
            </Sheet>
        </div>
    );
};


export default function NoCodeAlgoPage() {
    const router = useRouter();
    
    return (
        <div className="h-screen w-screen flex flex-col bg-background">
            <header className="flex-shrink-0 flex items-center justify-between px-4 h-16 border-b z-20">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <h1 className="text-lg font-semibold">No-Code Algo Builder</h1>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline"><Play className="h-4 w-4 mr-2" /> Run Test</Button>
                    <Button><Save className="h-4 w-4 mr-2" /> Save</Button>
                </div>
            </header>
            <main className="flex-1 overflow-hidden relative">
                 <ReactFlowProvider>
                    <Flow />
                 </ReactFlowProvider>
            </main>
        </div>
    );
}
