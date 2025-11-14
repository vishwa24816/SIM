
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, GripVertical, Code, MoveRight, Clock, GitBranch, ShoppingCart, DollarSign, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

type NodeCategory = 'Triggers' | 'Logic' | 'Data' | 'Actions';

interface Node {
  id: string;
  content: string;
  icon: React.ElementType;
  category: NodeCategory;
}

const INITIAL_NODES: Record<NodeCategory, Node[]> = {
  Triggers: [
    { id: 'trigger-1', content: 'On a Schedule', icon: Clock, category: 'Triggers' },
    { id: 'trigger-2', content: 'When Price Moves', icon: MoveRight, category: 'Triggers' },
  ],
  Data: [
    { id: 'data-1', content: 'Get Market Data', icon: Code, category: 'Data' },
  ],
  Logic: [
    { id: 'logic-1', content: 'If/Else Condition', icon: GitBranch, category: 'Logic' },
  ],
  Actions: [
    { id: 'action-1', content: 'Buy Order', icon: ShoppingCart, category: 'Actions' },
    { id: 'action-2', content: 'Sell Order', icon: DollarSign, category: 'Actions' },
    { id: 'action-3', content: 'Send Notification', icon: Bell, category: 'Actions' },
  ],
};


const NodeCard = ({ node, isDragging }: { node: Node, isDragging: boolean }) => {
    const Icon = node.icon;
    const categoryColorMap = {
        Triggers: 'bg-blue-500/10 text-blue-500',
        Data: 'bg-purple-500/10 text-purple-500',
        Logic: 'bg-orange-500/10 text-orange-500',
        Actions: 'bg-green-500/10 text-green-500',
    }
    return (
        <Card className={cn("mb-2 transition-shadow", isDragging && "shadow-lg")}>
            <CardContent className="p-3">
                <div className="flex items-center gap-3">
                    <GripVertical className="h-5 w-5 text-muted-foreground" />
                    <div className={cn("w-8 h-8 rounded-md flex items-center justify-center", categoryColorMap[node.category])}>
                        <Icon className="h-5 w-5" />
                    </div>
                    <span className="font-medium">{node.content}</span>
                </div>
            </CardContent>
        </Card>
    )
}

export default function NoCodeAlgoPage() {
  const router = useRouter();
  const [strategyNodes, setStrategyNodes] = React.useState<Node[]>([]);
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) {
      return;
    }
    
    // If dropping into the strategy canvas from the library
    if (destination.droppableId === 'strategyCanvas' && source.droppableId.startsWith('library-')) {
        const category = source.droppableId.split('-')[1] as NodeCategory;
        const nodeToCopy = INITIAL_NODES[category][source.index];

        const newStrategyNodes = Array.from(strategyNodes);
        newStrategyNodes.splice(destination.index, 0, { ...nodeToCopy, id: `${nodeToCopy.id}-${Date.now()}` });

        setStrategyNodes(newStrategyNodes);
    }
    // If reordering within the strategy canvas
    else if (destination.droppableId === 'strategyCanvas' && source.droppableId === 'strategyCanvas') {
        const newStrategyNodes = Array.from(strategyNodes);
        const [reorderedItem] = newStrategyNodes.splice(source.index, 1);
        newStrategyNodes.splice(destination.index, 0, reorderedItem);

        setStrategyNodes(newStrategyNodes);
    }
  };

  return (
    <div className="bg-background min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-xl font-bold">No-Code Algo Builder</h1>
          </div>
        </div>
      </header>

      {isClient && (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex-1 grid md:grid-cols-[300px_1fr] gap-4 p-4">
                {/* Sidebar with Nodes */}
                <Card>
                    <CardHeader>
                        <CardTitle>Building Blocks</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {Object.entries(INITIAL_NODES).map(([category, nodes]) => (
                            <div key={category}>
                                <h3 className="text-sm font-semibold text-muted-foreground my-2">{category}</h3>
                                <Droppable droppableId={`library-${category}`} isDropDisabled={true}>
                                    {(provided) => (
                                        <div ref={provided.innerRef} {...provided.droppableProps}>
                                            {nodes.map((node, index) => (
                                                <Draggable key={node.id} draggableId={node.id} index={index}>
                                                    {(provided, snapshot) => (
                                                         <>
                                                            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                                <NodeCard node={node} isDragging={snapshot.isDragging} />
                                                            </div>
                                                            {snapshot.isDragging && (
                                                                <div className="opacity-50"><NodeCard node={node} isDragging={false} /></div>
                                                            )}
                                                        </>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Strategy Canvas */}
                <Droppable droppableId="strategyCanvas">
                    {(provided, snapshot) => (
                        <Card ref={provided.innerRef} {...provided.droppableProps} className={cn("transition-colors", snapshot.isDraggingOver && "bg-muted/50")}>
                            <CardHeader>
                                <CardTitle>My Algo Strategy</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {strategyNodes.length === 0 ? (
                                     <div className="flex flex-col items-center justify-center text-center p-10 border-2 border-dashed rounded-lg">
                                        <p className="text-muted-foreground">Drag and drop blocks from the left to build your strategy.</p>
                                    </div>
                                ) : (
                                    strategyNodes.map((node, index) => (
                                         <Draggable key={node.id} draggableId={node.id} index={index}>
                                            {(provided, snapshot) => (
                                                <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                   <NodeCard node={node} isDragging={snapshot.isDragging} />
                                                </div>
                                            )}
                                        </Draggable>
                                    ))
                                )}
                                {provided.placeholder}
                            </CardContent>
                        </Card>
                    )}
                </Droppable>
            </div>
        </DragDropContext>
      )}
    </div>
  );
}
