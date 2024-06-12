// pages/index.js
'use client'
import React, { useState, useEffect } from 'react';
import ReactFlow, { MiniMap } from 'react-flow-renderer';

const Dashboard = () => {
  const [nodes, setNodes] = useState<{ id: any; type: string; data: { label: any; }; position: { x: number; y: number; }; }[]>([]);
  const [edges, setEdges] = useState<{ id: string; source: any; target: any; }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchNetworkData();
  }, []);

  const fetchNetworkData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/ping_scan', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      const formattedNodes = formatNodes(data);
      const deviceEdges = createEdges(formattedNodes);

      setNodes(formattedNodes);
      setEdges(deviceEdges);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatNodes = (data: any[]) => {
    return data.map((device, index) => {
      const position = index === 0 ? { x: 0, y: 0 } : calculatePosition(index, data.length);
      return {
        id: device.addresses.ipv4,
        type: 'default',
        data: { label: device.hostnames[0].name || device.addresses.ipv4 },
        position,
      };
    });
  };

  const createEdges = (nodes: any[]) => {
    return nodes.slice(1).map(node => {
      if (node.position.y > 0) {
        // Node is in the lower part of the circle
        return {
          id: `${node.id}-edge`,
          source: nodes[0].id,
          target: node.id,
        };
      } else {
        // Node is in the upper part of the circle
        return {
          id: `${node.id}-edge`,
          source: node.id,
          target: nodes[0].id,
        };
      }
    });
  };

  const handleScanNetwork = async () => {
    setNodes([]);
    setEdges([]);
    setIsLoading(true);

    try {
      const clearCacheResponse = await fetch('http://localhost:5000/api/clear_cache', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!clearCacheResponse.ok) {
        throw new Error('Failed to clear cache');
      }

      console.log('Cache cleared');
      await fetchNetworkData();
    } catch (error) {
      console.error('Error clearing cache or fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculatePosition = (index: number, totalDevices: number) => {
    const radius = 200;
    const angle = (Math.PI * 2) / (totalDevices - 1);
    const x = radius * Math.cos(angle * index);
    const y = radius * Math.sin(angle * index);
    return { x, y };
  };

  return (
    <>
    <div className="flex flex-col gap-4 relative">
      <h1 className="text-4xl sticky top-0 z-[10] p-6 bg-background/50 backdrop-blur-lg flex items-center border-b">
        Dashboard
      </h1>
      <div style={{ height: '100vh', backgroundColor: '#f0f0f0' }}>
        <button onClick={handleScanNetwork} disabled={isLoading}>
          {isLoading ? 'Scanning Network...' : 'Scan Network'}
        </button>
        <ReactFlow nodes={nodes} edges={edges} onLoad={() => console.log('Flow loaded')}>
          <MiniMap />
        </ReactFlow>
      </div>
    </div>
    </>
  );
};

export default Dashboard;
