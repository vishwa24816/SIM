
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
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { addDoc, collection, doc, updateDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { AlgoWorkflow } from '@/lib/types';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"


const Flow = () => {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [reactFlowInstance, setReactFlowInstance] = React.useState<ReactFlowInstance | null>(null);
    const [selectedNode, setSelectedNode] = React.useState<Node | null>(null);
    const [selectedWorkflow, setSelectedWorkflow] = React.useState<AlgoWorkflow | null>(null);

    const { user } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();

    const [isSaveAlertOpen, setIsSaveAlertOpen] = React.useState(false);
    const [strategyName, setStrategyName] = React.useState('');

    const workflowsCollectionRef = useMemoFirebase(() => {
        if (!user || !firestore) return null;
        return collection(firestore, `users/${user.uid}/algoWorkflows`);
    }, [user, firestore]);

    const { data: savedStrategies } = useCollection<AlgoWorkflow>(workflowsCollectionRef);

    const onConnect = React.useCallback(
        (params: Edge | Connection) => setEdges((eds) => addEdge({ ...params, type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed } }, eds)),
        [setEdges]
    );
    
    const onNodeDoubleClick = React.useCallback((event: React.MouseEvent, node: Node) => {
        setSelectedNode(node);
    }, []);

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

    const handleSaveStrategy = async () => {
      if (!user || !firestore || !reactFlowInstance) return;
      if (!strategyName.trim()) {
        toast({ title: 'Error', description: 'Please enter a name for your strategy.', variant: 'destructive' });
        return;
      }

      const flow = reactFlowInstance.toObject();

      // Sanitize nodes before saving: remove non-serializable data
      const sanitizedNodes = flow.nodes.map(node => {
          const { onDelete, ...serializableData } = node.data;
          return { ...node, data: serializableData };
      });

      const workflowData = {
        userId: user.uid,
        name: strategyName,
        nodes: sanitizedNodes,
        edges: flow.edges,
        updatedAt: serverTimestamp(),
      };
      
      try {
        if (selectedWorkflow && selectedWorkflow.id) {
            // Update existing workflow
            const workflowDoc = doc(firestore, `users/${user.uid}/algoWorkflows/${selectedWorkflow.id}`);
            await updateDoc(workflowDoc, workflowData);
            toast({ title: 'Success', description: 'Strategy updated successfully!' });
        } else {
            // Create new workflow
            await addDoc(collection(firestore, `users/${user.uid}/algoWorkflows`), {
              ...workflowData,
              createdAt: serverTimestamp(),
            });
            toast({ title: 'Success', description: 'Strategy saved successfully!' });
        }
      } catch (error) {
        console.error("Error saving strategy:", error);
        toast({ title: 'Error', description: 'Failed to save strategy.', variant: 'destructive' });
      }

      setIsSaveAlertOpen(false);
      setStrategyName('');
      setSelectedWorkflow(null);
    };

    const handleLoadStrategy = (workflow: AlgoWorkflow) => {
        const { nodes: savedNodes, edges: savedEdges } = workflow;
        setNodes(savedNodes.map(node => ({ ...node, data: { ...node.data, onDelete: deleteNode } })));
        setEdges(savedEdges);
        setSelectedWorkflow(workflow);
        setStrategyName(workflow.name);
        toast({ title: 'Loaded', description: `Strategy "${workflow.name}" loaded.` });
    };
    
    const handleSaveClick = () => {
        setIsSaveAlertOpen(true);
    };

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
                onNodeDoubleClick={onNodeDoubleClick}
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
                                            {savedStrategies && savedStrategies.length > 0 ? (
                                                savedStrategies.map(strategy => (
                                                    <div 
                                                        key={strategy.id} 
                                                        className="flex items-center justify-between p-2 border rounded-md bg-card hover:bg-muted cursor-pointer"
                                                        onClick={() => handleLoadStrategy(strategy)}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <History className="w-4 h-4 text-primary" />
                                                            <span className="text-sm">{strategy.name}</span>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-sm text-muted-foreground text-center p-4">No saved strategies.</p>
                                            )}
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </div>
                    </ScrollArea>
                </SheetContent>
            </Sheet>
            <AlertDialog open={isSaveAlertOpen} onOpenChange={setIsSaveAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Save Strategy</AlertDialogTitle>
                        <AlertDialogDescription>
                            Enter a name for your strategy. If it's an existing strategy, it will be updated.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <Input 
                        placeholder="e.g., My Awesome BTC Strategy"
                        value={strategyName}
                        onChange={(e) => setStrategyName(e.target.value)}
                    />
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleSaveStrategy}>Save</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                <Button variant="outline"><Play className="h-4 w-4 mr-2" /> Run Test</Button>
                <Button onClick={handleSaveClick}><Save className="h-4 w-4 mr-2" /> Save</Button>
            </div>
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
            </header>
            <main className="flex-1 overflow-hidden relative">
                 <ReactFlowProvider>
                    <Flow />
                 </ReactFlowProvider>
            </main>
        </div>
    );
}

    