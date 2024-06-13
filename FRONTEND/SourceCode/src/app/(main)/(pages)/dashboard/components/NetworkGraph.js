// components/NetworkGraph.js
import React, { useMemo } from 'react';
import ReactFlow, { Background, Controls, MiniMap } from 'reactflow';
import RouterNodeComponent from '../types/RouterNodeComponent';
import DeviceNodeComponent from '../types/DeviceNodeComponent';
import DefaultEdge from '../types/DefaultEdge'; 

const NetworkGraph = ({ nodes, edges, handleClickCanvas }) => {
    const nodeTypes = useMemo(
        () => ({
            Router: RouterNodeComponent,
            Device: DeviceNodeComponent,
        }),
        []
    );

    const edgeTypes = useMemo(
        () => ({
            default: DefaultEdge,
        }),
        []
    );

    return (
        <ReactFlow
            nodes={nodes}
            edges={edges}
            onClick={handleClickCanvas}
            className="!bg-background"
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
        >
            <Controls position="top-left" />
            <Background variant="dots" gap={12} size={1} />
        </ReactFlow>
    );
};

export default NetworkGraph;
