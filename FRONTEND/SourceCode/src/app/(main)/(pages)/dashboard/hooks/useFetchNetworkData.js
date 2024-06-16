// hooks/useFetchNetworkData.js
import { useState, useEffect } from 'react';
import { Position } from 'react-flow-renderer';

const useFetchNetworkData = (viewportWidth, viewportHeight) => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  var routerIP = "";

  const fetchNetworkData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/ping_scan', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      try {
        const routerResponse = await fetch('http://localhost:5000/api/get_gateway', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        routerIP = await routerResponse.json();
      } catch (error) { console.error('Error fetching router data:', error); };

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
  }, [viewportWidth, viewportHeight]);

  const formatNodes = (data) => {
    const centerX = 500;
    const centerY = 200;

    return data.map((device, index) => {
      var type = 'Device';
      if (device.addresses.ipv4 === routerIP) {
        var type = 'Router';
      }

      var routerindex = data.findIndex((device) => device.addresses.ipv4 === routerIP);

      if (type === 'Router') {
        var position = { x: centerX, y: centerY };
      } else {
        if (index <= routerindex) {
          var position = calculatePosition(index, data.length - 1, centerX, centerY);
        } else {
          var position = calculatePosition(index - 1, data.length - 1, centerX, centerY);
        }
      }
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
    return nodes.slice(1).map((node) => {
      const routerNode = nodes[0];
      const handlePosition = node.data.handlePosition;
  
      let sourceHandleId = 'bottom'; 
      let targetHandleId = 'top';
  
      if (handlePosition === Position.Right) {
        sourceHandleId = 'right';
        targetHandleId = 'left';
      } else if (handlePosition === Position.Left) {
        sourceHandleId = 'left';
        targetHandleId = 'right';
      } else if (handlePosition === Position.Top) {
        sourceHandleId = 'top';
        targetHandleId = 'bottom';
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
