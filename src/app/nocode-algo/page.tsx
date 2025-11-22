
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
} from 'reactflow';
import 'reactflow/dist/style.css';

import { Button } from '@/components/ui/button';
import { initialNodes, nodeTypes as customNodeTypes, nodeCategories, DRAGGABLE_TYPE, SidebarNode } from '@/components/trade/algo-nodes';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useRouter } from 'next/navigation';

const Flow = () => {
    const reactFlowWrapper = React.useRef<HTMLDivElement>(null);
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [reactFlowInstance, setReactFlowInstance] = React.useState<ReactFlowInstance | null>(null);

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

            if (!reactFlowWrapper.current || !reactFlowInstance) {
                return;
            }
            
            const dataString = event.dataTransfer.getData(DRAGGABLE_TYPE);

            if (!dataString) {
                return;
            }
            
            const data = JSON.parse(dataString);
            
            const position = reactFlowInstance.screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });
            
            const newNode: Node = {
                id: `${data.nodeType}-${nodes.length + 1}`,
                type: data.nodeType,
                position,
                data: { label: data.label, icon: data.icon, category: data.category },
            };

            setNodes((nds) => nds.concat(newNode));
        },
        [reactFlowInstance, nodes.length, setNodes]
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
                <Controls />
                <MiniMap />
            </ReactFlow>
        </div>
    );
};


export default function NoCodeAlgoPage() {
    const router = useRouter();
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
                                                    <SidebarNode key={node.label} {...node} />
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
                    <Flow />
                 </ReactFlowProvider>
            </main>
        </div>
    );
}
