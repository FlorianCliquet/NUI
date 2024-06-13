// hooks/useFetchNetworkData.js
import { useState, useEffect } from 'react';

const useFetchNetworkData = (viewportWidth, viewportHeight) => {
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
    const centerX = 500;
    const centerY = 200;

    return data.map((device, index) => {
      const type = index === 0 ? 'Router' : 'Device';
      const position = index === 0 ? { x: centerX, y: centerY } : calculatePosition(index - 1, data.length - 1, centerX, centerY);
      return {
        id: device.addresses.ipv4,
        type,
        data: { label: device.hostnames[0].name || device.addresses.ipv4 },
        position,
      };
    });
  };

  const createEdges = (nodes) => {
    return nodes.slice(1).map((node) => {
        if (node.position.y > nodes[0].position.y) {
            return {
                id: `${node.id}-edge`,
                source: nodes[0].id,
                target: node.id,
                type: 'default',
            };
        } else {
            return {
                id: `${node.id}-edge`,
                source: node.id,
                target: nodes[0].id,
                type: 'default',
            };
        }
    });
};

  const calculatePosition = (index, totalDevices, centerX, centerY) => {
    const radius = 400;
    const angle = (index * 2 * Math.PI) / totalDevices;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    return { x, y };
  };

  return { nodes, edges, isLoading, fetchNetworkData };
};

export default useFetchNetworkData;