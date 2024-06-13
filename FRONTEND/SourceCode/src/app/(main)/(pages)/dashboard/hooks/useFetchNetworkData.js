// hooks/useFetchNetworkData.js
import { useState, useEffect } from 'react';

const useFetchNetworkData = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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

  useEffect(() => {
    fetchNetworkData();
  }, []);

  const formatNodes = (data) => {
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

  const createEdges = (nodes) => {
    return nodes.slice(1).map((node) => {
      if (node.position.y > 0) {
        return {
          id: `${node.id}-edge`,
          source: nodes[0].id,
          target: node.id,
        };
      } else {
        return {
          id: `${node.id}-edge`,
          source: node.id,
          target: nodes[0].id,
        };
      }
    });
  };

  const calculatePosition = (index, totalDevices) => {
    const radius = 200;
    const angle = (Math.PI * 2) / (totalDevices - 1);
    const x = radius * Math.cos(angle * index);
    const y = radius * Math.sin(angle * index);
    return { x, y };
  };

  return { nodes, edges, isLoading, fetchNetworkData };
};

export default useFetchNetworkData;
