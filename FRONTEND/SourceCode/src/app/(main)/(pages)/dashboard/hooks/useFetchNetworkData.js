import { useState, useEffect } from 'react';
import { Position } from 'react-flow-renderer';

const useFetchNetworkData = (viewportWidth, viewportHeight) => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [routerIP, setRouterIP] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  // Fetch router IP address from backend API
  const fetchRouterData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/get_gateway', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch');
      }
      const routerData = await response.json();
      setRouterIP(routerData.gateway); // Set fetched router IP
    } catch (error) {
      handleFetchError(error); // Handle fetch errors, retry logic
    }
  };

  // Handle fetch errors and retry logic
  const handleFetchError = (error) => {
    console.error('Error:', error.message);
    if (retryCount < MAX_RETRIES) {
      console.log('Retrying...');
      setRetryCount(retryCount + 1);
    } else {
      console.error('Max retries exceeded. Unable to fetch data.');
    }
  };

  // Fetch network data based on viewport dimensions and router IP
  const fetchNetworkData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/ping_scan', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch');
      }
      const data = await response.json();
      const formattedNodes = formatNodes(data.hosts); // Format fetched data into nodes
      const deviceEdges = createEdges(formattedNodes); // Create edges between nodes
      setNodes(formattedNodes); // Update nodes state
      setEdges(deviceEdges); // Update edges state
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false); // Set loading state to false after fetch completes
    }
  };

  // Format raw data into nodes with positions
  const formatNodes = (data) => {
    const centerX = 500;
    const centerY = 200;
    const routerIndex = data.findIndex((device) => device.addresses.ipv4 === routerIP);
    return data.map((device, index) => {
      const type = device.addresses.ipv4 === routerIP ? 'Router' : 'Device';
      const position = type === 'Router'
        ? { x: centerX, y: centerY } // Center router node
        : calculatePosition(index <= routerIndex ? index : index - 1, data.length - 1, centerX, centerY); // Calculate position for devices
      const handlePosition = type === 'Router' ? null : calculateHandlePosition(position, centerX, centerY); // Calculate handle position for devices
      const label = device.hostnames[0]?.name || device.addresses.ipv4; // Label for node
      return {
        id: device.addresses.ipv4,
        type,
        data: { label, handlePosition },
        position,
      };
    });
  };

  // Calculate node position based on index and total devices
  const calculatePosition = (index, totalDevices, centerX, centerY) => {
    const radius = 500; // Radius from center
    const angle = (index * 2 * Math.PI) / totalDevices; // Angle based on index
    const x = centerX + radius * Math.cos(angle); // X position
    const y = centerY + radius * Math.sin(angle); // Y position
    return { x, y };
  };

  // Calculate handle position relative to router for node connections
  const calculateHandlePosition = (position, routerX, routerY) => {
    const tolerance = 50;
    if (position.y > routerY + tolerance) {
      return Position.Top; // Node above router
    } else if (position.y < routerY - tolerance) {
      return Position.Bottom; // Node below router
    } else if (position.x > routerX + tolerance) {
      return Position.Left; // Node left of router
    } else {
      return Position.Right; // Node right of router
    }
  };

  // Create edges between nodes, connecting them to the router
  const createEdges = (nodes) => {
    const routerNode = nodes.find((node) => node.type === 'Router');
    if (!routerNode) {
      console.error('Router node not found');
      return [];
    }
    return nodes.filter((node) => node.type !== 'Router').map((node) => ({
      id: `${node.id}-edge`,
      source: routerNode.id,
      sourceHandle: node.data.handlePosition === Position.Right ? 'right' : 'left',
      target: node.id,
      targetHandle: node.data.handlePosition === Position.Right ? 'left' : 'right',
      type: 'default',
    }));
  };

  // Effect to fetch router data on retry or initial load
  useEffect(() => {
    const fetchData = async () => {
      await fetchRouterData();
    };
    if (routerIP === null && retryCount < MAX_RETRIES) {
      fetchData();
    }
  }, [retryCount, routerIP]);

  // Effect to fetch network data when router IP and viewport dimensions change
  useEffect(() => {
    if (routerIP !== null) {
      fetchNetworkData();
    }
  }, [viewportWidth, viewportHeight, routerIP]);

  // Effect to log nodes and edges for debugging purposes
  useEffect(() => {
    console.log('Nodes:', nodes);
    console.log('Edges:', edges);
  }, [nodes, edges]);

  // Return nodes, edges, loading state, and fetch function for use in components
  return { nodes, edges, isLoading, fetchNetworkData,routerIP };
};

export default useFetchNetworkData;
