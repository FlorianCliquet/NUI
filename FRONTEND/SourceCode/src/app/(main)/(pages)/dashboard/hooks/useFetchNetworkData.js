import { useState, useEffect } from 'react';
import { Position } from 'react-flow-renderer';

const useFetchNetworkData = (viewportWidth, viewportHeight) => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [routerIP, setRouterIP] = useState(null);

  const fetchRouterData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/get_gateway', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const routerData = await response.json();
      setRouterIP(routerData);
    } catch (error) {
      console.error('Error fetching router data:', error);
    }
  };

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
    fetchRouterData();
  }, []);

  useEffect(() => {
    if (routerIP) {
      fetchNetworkData();
    }
  }, [viewportWidth, viewportHeight, routerIP]);

  const formatNodes = (data) => {
    const centerX = 500;
    const centerY = 200;

    return data.map((device, index) => {
      const type = device.addresses.ipv4 === routerIP ? 'Router' : 'Device';
      const routerIndex = data.findIndex((d) => d.addresses.ipv4 === routerIP);
      const position = type === 'Router'
        ? { x: centerX, y: centerY }
        : calculatePosition(index <= routerIndex ? index : index - 1, data.length - 1, centerX, centerY);

      const handlePosition = type === 'Router' ? null : calculateHandlePosition(position, centerX, centerY);

      return {
        id: device.addresses.ipv4,
        type,
        data: { label: device.hostnames[0]?.name || device.addresses.ipv4, handlePosition },
        position,
      };
    });
  };

  const calculateHandlePosition = (position, routerX, routerY) => {
    const tolerance = 50;
    if (position.y > routerY + tolerance) {
      return Position.Top;
    } else if (position.y < routerY - tolerance) {
      return Position.Bottom;
    } else if (position.x > routerX + tolerance) {
      return Position.Left;
    } else {
      return Position.Right;
    }
  };

  const createEdges = (nodes) => {
    const routerNode = nodes.find(node => node.type === 'Router');
    return nodes.filter(node => node.type !== 'Router').map((node) => {
      const handlePosition = node.data.handlePosition;
      let sourceHandleId = 'bottom';
      let targetHandleId = 'top';

      // Update handle IDs based on the calculated handle position
      if (handlePosition === Position.Right) {
        sourceHandleId = 'right';
        targetHandleId = 'left';
      } else if (handlePosition === Position.Left) {
        sourceHandleId = 'left';
        targetHandleId = 'right';
      } else if (handlePosition === Position.Top) {
        sourceHandleId = 'top';
        targetHandleId = 'bottom';
      } else if (handlePosition === Position.Bottom) {
        sourceHandleId = 'bottom';
        targetHandleId = 'top';
      }

      return {
        id: `${node.id}-edge`,
        source: routerNode.id,
        sourceHandle: sourceHandleId,
        target: node.id,
        targetHandle: targetHandleId,
        type: 'default',
      };
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
