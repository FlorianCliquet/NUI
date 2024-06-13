// components/NetworkGraph.js
import React from 'react';
import ReactFlow, { Background, Controls, MiniMap } from 'reactflow';

const NetworkGraph = ({ nodes, edges, handleClickCanvas }) => (
  <ReactFlow
    nodes={nodes}
    edges={edges}
    fitView
    onClick={handleClickCanvas}
  >
    <Controls position="top-left" />
    <MiniMap position="bottom-left" className="!bg-background" zoomable pannable />
    <Background variant="dots" gap={12} size={1} />
  </ReactFlow>
);

export default NetworkGraph;
