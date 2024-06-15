// hooks/useFetchNetworkData.js
import { useState, useEffect } from 'react';

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
  }, []);

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