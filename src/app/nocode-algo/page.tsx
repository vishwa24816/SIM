
'use client';

import * as React from 'react';
import { 
    ArrowLeft, 
    Save, 
    Play, 
    Menu,
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
  useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { Button } from '@/components/ui/button';
import { initialNodes, nodeTypes as customNodeTypes, nodeCategories, SidebarNode } from '@/components/trade/algo-nodes';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useRouter } from 'next/navigation';

const Flow = () => {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    const onConnect = React.useCallback(
        (params: Edge | Connection) => setEdges((eds) => addEdge({ ...params, type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } }, eds)),
        [setEdges]
    );

    return (
        <div className="h-full w-full">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={customNodeTypes}
                fitView
                className="bg-background dot-grid"
            >
                <Background />
                <Controls />
                <MiniMap />
            </ReactFlow>
        </div>
    );
};


export default function NoCodeAlgoPage() {
    const router = useRouter();
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [reactFlowInstance, setReactFlowInstance] = React.useState<ReactFlowInstance | null>(null);

    const onConnect = React.useCallback(
        (params: Edge | Connection) => setEdges((eds) => addEdge({ ...params, type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } }, eds)),
        [setEdges]
    );
    
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
            data: { label: nodeData.label, icon: nodeData.icon, category: nodeData.category },
        };

        setNodes((nds) => nds.concat(newNode));
    };

    
    return (
        <div className="h-screen w-screen flex flex-col bg-background">
            <header className="flex-shrink-0 flex items-center justify-between px-4 h-16 border-b z-20">
                <div className="flex items-center gap-2">
                     <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Open Nodes</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left">
                            <SheetHeader>
                                <SheetTitle>Nodes</SheetTitle>
                            </SheetHeader>
                            <Accordion type="multiple" className="w-full">
                                {nodeCategories.map(category => (
                                    <AccordionItem value={category.title} key={category.title}>
                                        <AccordionTrigger>{category.title}</AccordionTrigger>
                                        <AccordionContent>
                                            <div className="space-y-2">
                                                {category.nodes.map(node => (
                                                    <SidebarNode 
                                                        key={node.label} 
                                                        onNodeClick={addNode}
                                                        {...node} 
                                                    />
                                                ))}
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </SheetContent>
                    </Sheet>
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
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        onInit={setReactFlowInstance}
                        nodeTypes={customNodeTypes}
                        fitView
                        className="bg-background dot-grid"
                    >
                        <Background />
                        <Controls />
                        <MiniMap />
                    </ReactFlow>
                 </ReactFlowProvider>
            </main>
        </div>
    );
}
