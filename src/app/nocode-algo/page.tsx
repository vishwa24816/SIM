'use client';

import * as React from 'react';
import { 
    ArrowLeft, 
    Save, 
    Play, 
    Menu
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
  useReactFlow,
  Connection,
  NodeTypes,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { initialNodes, nodeTypes as customNodeTypes, nodeCategories, DRAGGABLE_TYPE } from '@/components/trade/algo-nodes';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const Flow = () => {
    const reactFlowWrapper = React.useRef<HTMLDivElement>(null);
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [reactFlowInstance, setReactFlowInstance] = React.useState<any>(null);

    const onConnect = React.useCallback(
        (params: Edge | Connection) => setEdges((eds) => addEdge({ ...params, type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } }, eds)),
        [setEdges]
    );

    const onDragOver = React.useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = React.useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();

            if (!reactFlowWrapper.current || !reactFlowInstance) return;
            
            const type = event.dataTransfer.getData(DRAGGABLE_TYPE);
            const dataString = event.dataTransfer.getData('application/reactflow-data');

            if (typeof type === 'undefined' || !type) {
                return;
            }
            
            const position = reactFlowInstance.project({
                x: event.clientX,
                y: event.clientY,
            });
            const data = JSON.parse(dataString);
            
            const newNode: Node = {
                id: `${type}-${nodes.length + 1}`,
                type,
                position,
                data: { label: data.label, icon: data.icon, category: data.category },
            };

            setNodes((nds) => nds.concat(newNode));
        },
        [reactFlowInstance, nodes, setNodes]
    );
    
    return (
        <div className="h-full w-full" ref={reactFlowWrapper}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onInit={setReactFlowInstance}
                onDrop={onDrop}
                onDragOver={onDragOver}
                nodeTypes={customNodeTypes}
                fitView
                className="bg-background dot-grid"
            >
                <Background />
            </ReactFlow>
        </div>
    );
};

const SidebarNode = ({ nodeType, label, icon: Icon, category }: { nodeType: string; label: string; icon: React.ElementType; category: string }) => {
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


export default function NoCodeAlgoPage() {
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
                                                    <SidebarNode key={node.type} {...node} category={category.title} />
                                                ))}
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </SheetContent>
                    </Sheet>
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
