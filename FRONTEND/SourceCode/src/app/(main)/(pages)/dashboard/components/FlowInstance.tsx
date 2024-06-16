'use client';
import { ScanButton } from './ScanButton';
import React from 'react';
import useFetchNetworkData from './../hooks/useFetchNetworkData';

type Props = {
  children: React.ReactNode;
  edges: any[];
  nodes: any[];
  isLoading: boolean;
  onScan: () => void;
};

const FlowInstance = ({ children, edges, nodes, isLoading, onScan }: Props) => {
  return (
    <div className="flex flex-col gap-2">
      <ScanButton isLoading={isLoading} onClick={onScan} />
      {children}
      <div className="flex flex-col gap-2">
        <h1>Nodes</h1>
        <div className="flex flex-col gap-1">
          {nodes.map((node) => (
            <div key={node.id}>{node.data.label}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FlowInstance;
