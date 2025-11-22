
'use client';

import * as React from 'react';
import { 
    ArrowLeft, 
    Save, 
    Play, 
    ZoomIn, 
    ZoomOut, 
    Trash2,
    Copy,
    PanelRight,
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
    X,
    FileText,
    History
} from 'lucide-react';
import ReactFlow, {
  ReactFlowProvider,
  Controls,
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
  NodeProps,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'trigger',
    position: { x: 100, y: 150 },
    data: { label: 'On a Schedule' },
  },
];

const CustomNode = ({ data, type }: NodeProps<any> & { icon: React.ElementType; category: string }) => {
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
                        <p className="text-xs text-muted-foreground">{data.category || type}</p>
                    </div>
                </div>
            </CardHeader>
        </Card>
    );
};

const customNodeTypes: NodeTypes = {
  trigger: (props) => <CustomNode {...props} icon={Clock} category="Triggers" />,
  data: (props) => <CustomNode {...props} icon={Database} category="Data" />,
  logic: (props) => <CustomNode {...props} icon={GitBranch} category="Logic" />,
  action: (props) => <CustomNode {...props} icon={HandCoins} category="Actions" />,
  utility: (props) => <CustomNode {...props} icon={BringToFront} category="Utility" />,
};

const SettingsPanel = ({ selectedNode, updateNodeData }: { selectedNode: Node | null, updateNodeData: (id: string, data: any) => void }) => {
    const [label, setLabel] = React.useState(selectedNode?.data.label || '');

    React.useEffect(() => {
        setLabel(selectedNode?.data.label || '');
    }, [selectedNode]);

    const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLabel(e.target.value);
    };

    const handleBlur = () => {
        if (selectedNode) {
            updateNodeData(selectedNode.id, { ...selectedNode.data, label });
        }
    };

    return (
        <div className="absolute right-4 top-20 w-80 bg-card border rounded-lg shadow-lg z-10 p-4 space-y-4">
            <h2 className="text-lg font-semibold">Settings</h2>
            {selectedNode ? (
                <div>
                    <Label htmlFor="node-label">Label</Label>
                    <Input id="node-label" value={label} onChange={handleLabelChange} onBlur={handleBlur} />
                    {/* Add more settings based on node type */}
                </div>
            ) : (
                <p className="text-muted-foreground text-sm">Select a node to see its settings.</p>
            )}
        </div>
    );
};


const Flow = () => {
    const reactFlowWrapper = React.useRef<HTMLDivElement>(null);
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [reactFlowInstance, setReactFlowInstance] = React.useState<any>(null);
    const { setViewport, zoomIn, zoomOut } = useReactFlow();
    const [selectedNode, setSelectedNode] = React.useState<Node | null>(null);
    const [isSettingsPanelOpen, setIsSettingsPanelOpen] = React.useState(true);

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

            const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
            const type = event.dataTransfer.getData('application/reactflow-type');
            const dataString = event.dataTransfer.getData('application/reactflow-data');

            if (typeof type === 'undefined' || !type) {
                return;
            }

            const position = reactFlowInstance.project({
                x: event.clientX - reactFlowBounds.left,
                y: event.clientY - reactFlowBounds.top,
            });
            
            const data = JSON.parse(dataString);
            
            const newNode: Node = {
                id: `${type}-${nodes.length + 1}`,
                type,
                position,
                data: { label: data.label, icon: data.icon },
            };

            setNodes((nds) => nds.concat(newNode));
        },
        [reactFlowInstance, nodes, setNodes]
    );

    const onNodeClick = (_: React.MouseEvent, node: Node) => {
        setSelectedNode(node);
    };
    
    const updateNodeData = (id: string, data: any) => {
        setNodes((nds) => nds.map(node => node.id === id ? { ...node, data: { ...node.data, ...data } } : node));
        if (selectedNode?.id === id) {
            setSelectedNode(prev => prev ? { ...prev, data: { ...prev.data, ...data } } : null);
        }
    };

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
                onNodeClick={onNodeClick}
                onPaneClick={() => setSelectedNode(null)}
                nodeTypes={customNodeTypes}
                fitView
                className="bg-background dot-grid"
            >
                <Controls showZoom={false} showFitView={false} className="!left-auto !right-4" />
                <Background />
            </ReactFlow>
            {isSettingsPanelOpen && <SettingsPanel selectedNode={selectedNode} updateNodeData={updateNodeData} />}
            <div className="absolute top-4 right-4 z-10 flex gap-2">
                 <Button variant="outline" size="icon" onClick={() => zoomIn()}><ZoomIn className="h-4 w-4" /></Button>
                 <Button variant="outline" size="icon" onClick={() => zoomOut()}><ZoomOut className="h-4 w-4" /></Button>
                 <Button variant="outline" size="icon" onClick={() => setViewport({ x: 0, y: 0, zoom: 1 }, { duration: 800 })}><Copy className="h-4 w-4" /></Button>
                 <Button variant="outline" size="icon" onClick={() => setNodes(nodes => nodes.filter(n => n.id !== selectedNode?.id))} disabled={!selectedNode}><Trash2 className="h-4 w-4" /></Button>
                 <Button variant="outline" size="icon" onClick={() => setIsSettingsPanelOpen(p => !p)}><PanelRight className="h-4 w-4" /></Button>
            </div>
        </div>
    );
};

export default function NoCodeAlgoPage() {
    return (
        <div className="h-screen w-screen flex flex-col bg-background">
            <header className="flex-shrink-0 flex items-center justify-between px-4 h-16 border-b z-20">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button>
                    <h1 className="text-lg font-semibold">No-Code Algo Builder</h1>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline"><Play className="h-4 w-4 mr-2" /> Run Test</Button>
                    <Button><Save className="h-4 w-4 mr-2" /> Save</Button>
                </div>
            </header>
            <main className="flex-1 overflow-hidden">
                 <ReactFlowProvider>
                    <Flow />
                 </ReactFlowProvider>
            </main>
        </div>
    );
}
