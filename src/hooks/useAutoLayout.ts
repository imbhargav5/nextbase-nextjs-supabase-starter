'use client';

import { useEffect, useState } from 'react';
import { Node, Edge } from '@xyflow/react';
import dagre from 'dagre';

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 250;
const nodeHeight = 100;

export function useAutoLayout(nodes: Node[], edges: Edge[]) {
  const [layoutedNodes, setLayoutedNodes] = useState<Node[]>(nodes);

  useEffect(() => {
    dagreGraph.setGraph({ rankdir: 'TB' });

    nodes.forEach((node) => {
      dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });

    edges.forEach((edge) => {
      dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    const layouted = nodes.map((node) => {
      const nodeWithPosition = dagreGraph.node(node.id);
      return {
        ...node,
        position: {
          x: nodeWithPosition.x - nodeWidth / 2,
          y: nodeWithPosition.y - nodeHeight / 2,
        },
      };
    });

    setLayoutedNodes(layouted);
  }, [nodes, edges]);

  return layoutedNodes;
}