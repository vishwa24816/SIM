
'use client';

import * as React from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Play, Save, Trash2, GripVertical, Settings, Plus, Zap, GitBranch, ShoppingCart, HelpCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

type Node = {
  id: string;
  type: string;
  content: string;
  icon: React.ElementType;
  category: 'trigger' | 'logic' | 'action';
};

const initialNodes: Record<string, Node> = {
  'trigger-1': { id: 'trigger-1', type: 'Trigger', content: 'On a Schedule', icon: Zap, category: 'trigger' },
  'logic-1': { id: 'logic-1', type: 'Logic', content: 'If / Else', icon: GitBranch, category: 'logic' },
  'logic-2': { id: 'logic-2', type: 'Logic', content: 'Get Price Data', icon: HelpCircle, category: 'logic' },
  'action-1': { id: 'action-1', type: 'Action', content: 'Buy', icon: ShoppingCart, category: 'action' },
  'action-2': { id: 'action-2', type: 'Action', content: 'Sell', icon: ShoppingCart, category: 'action' },
};


const NodeItem = ({ node, index }: { node: Node; index: number }) => {
  return (
    <Draggable draggableId={node.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={cn(
            'p-2 mb-2 rounded-lg border bg-card text-card-foreground shadow-sm flex items-center gap-2',
            snapshot.isDragging && 'bg-primary text-primary-foreground'
          )}
        >
          <GripVertical className="h-5 w-5 text-muted-foreground" />
          <node.icon className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium">{node.content}</span>
        </div>
      )}
    </Draggable>
  );
};


export default function NoCodeAlgoPage() {
  const router = useRouter();
  const [columns, setColumns] = React.useState({
    toolbox: {
      id: 'toolbox',
      title: 'Toolbox',
      nodeIds: Object.keys(initialNodes),
    },
    workspace: {
      id: 'workspace',
      title: 'Workspace',
      nodeIds: [],
    },
  });
  const [selectedNode, setSelectedNode] = React.useState<Node | null>(null);

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) {
      return;
    }
    // For now, we don't handle reordering or moving between columns
  };

  const triggers = Object.values(initialNodes).filter(n => n.category === 'trigger');
  const logic = Object.values(initialNodes).filter(n => n.category === 'logic');
  const actions = Object.values(initialNodes).filter(n => n.category === 'action');

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex h-screen bg-background text-foreground font-sans">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 h-16 bg-card border-b z-30 flex items-center px-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold text-muted-foreground">Algo Builder</h1>
          </div>
          <div className="flex-grow" />
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Trash2 className="h-4 w-4 mr-2" />
              Clear
            </Button>
            <Button variant="outline" size="sm">
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button size="sm">
              <Play className="h-4 w-4 mr-2" />
              Deploy
            </Button>
          </div>
        </header>

        <div className="flex pt-16 w-full h-full">
          {/* Toolbox */}
          <aside className="w-64 border-r bg-card flex-shrink-0 p-4 space-y-4">
            <h2 className="text-lg font-semibold">Nodes</h2>
             <Droppable droppableId="toolbox">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                    <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Triggers</h3>
                        {triggers.map((node, index) => <NodeItem key={node.id} node={node} index={index} />)}
                    </div>
                     <Separator className="my-4" />
                     <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Logic</h3>
                        {logic.map((node, index) => <NodeItem key={node.id} node={node} index={index + triggers.length} />)}
                    </div>
                    <Separator className="my-4" />
                    <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Actions</h3>
                        {actions.map((node, index) => <NodeItem key={node.id} node={node} index={index + triggers.length + logic.length} />)}
                    </div>
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </aside>

          {/* Workspace */}
          <main className="flex-1 bg-muted/30 p-8">
            <Droppable droppableId="workspace">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={cn(
                    'h-full w-full rounded-lg border-2 border-dashed bg-card/50 transition-colors',
                    snapshot.isDraggingOver ? 'border-primary bg-primary/10' : 'border-border'
                  )}
                >
                  <div className="flex items-center justify-center h-full">
                      <div className="text-center text-muted-foreground">
                        <Plus className="mx-auto h-12 w-12" />
                        <h3 className="mt-4 text-lg font-medium">Drag nodes here to build</h3>
                        <p className="mt-1 text-sm">Start with a trigger to create your algorithm.</p>
                      </div>
                  </div>
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </main>

          {/* Properties Panel */}
          <aside className="w-80 border-l bg-card flex-shrink-0 p-4">
             <div className="flex items-center gap-2 mb-4">
                <Settings className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Properties</h2>
            </div>

            {selectedNode ? (
                <div className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <selectedNode.icon className="h-5 w-5"/>
                                {selectedNode.content}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                             <div className="space-y-2">
                                <Label htmlFor="node-id">Node ID</Label>
                                <Input id="node-id" value={selectedNode.id} readOnly disabled />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            ) : (
                <div className="flex items-center justify-center h-full text-center text-muted-foreground">
                    <p>Select a node to see its properties.</p>
                </div>
            )}
          </aside>
        </div>
      </div>
    </DragDropContext>
  );
}
