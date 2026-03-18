'use client';

import { ReactFlow, Background, Controls, MiniMap, useNodesState, useEdgesState } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { OrgMemberNode } from './OrgMemberNode';
import { useAutoLayout } from '@/hooks/useAutoLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { OrgMemberNode as OrgMemberNodeType, OrgMemberEdge } from '@/types';

interface OrgChartProps {
  teamId: string;
  nodes: OrgMemberNodeType[];
  edges: OrgMemberEdge[];
}

export function OrgChart({ teamId, nodes, edges }: OrgChartProps) {
  const layoutedNodes = useAutoLayout(nodes, edges);
  const [nodeState, , onNodesChange] = useNodesState(layoutedNodes);
  const [edgeState, , onEdgesChange] = useEdgesState(edges);

  return (
    <Card className="h-[600px] w-full">
      <CardHeader>
        <CardTitle>Organization Chart</CardTitle>
      </CardHeader>
      <CardContent className="h-[calc(100%-60px)]">
        <ReactFlow
          nodes={nodeState}
          edges={edgeState}
          nodeTypes={{ orgMember: OrgMemberNode }}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView
          proOptions={{ hideAttribution: true }}
        >
          <Background />
          <Controls />
          <MiniMap nodeColor={(n) => (n.data.departmentColor as string) ?? '#6366f1'} />
        </ReactFlow>
      </CardContent>
    </Card>
  );
}