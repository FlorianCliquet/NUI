// pages/index.js
'use client'
import React, { useState, useEffect } from 'react';
import ReactFlow, { MiniMap } from 'react-flow-renderer';

const Dashboard = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // State to track loading state

  useEffect(() => {
    fetchNetworkData(); // Fetch network data when component mounts
  }, []); 

  const fetchNetworkData = () => {
    setIsLoading(true); // Set loading state to true when fetching data
    const cachedNodes = localStorage.getItem('cachedNodes');
    if (cachedNodes) {
      setNodes(JSON.parse(cachedNodes));
      setIsLoading(false); // Set loading state to false if data is retrieved from cache
    } else {
      fetch('http://localhost:5000/api/ping_scan', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
       .then(response => response.json())
       .then(data => {
          const formattedNodes = data.map((device, index) => {
            const position = index === 0 ? { x: 0.5, y: 0.5 } : calculatePosition(index, data.length);
            return {
              id: device.addresses.ipv4,
              type: 'default',
              data: { label: device.hostnames[0].name || device.addresses.ipv4 },
              position,
            };
          });
          setNodes(formattedNodes);

          // Create edges between devices and the router
          const deviceEdges = formattedNodes.slice(1).map(node => ({
            id: `${node.id}-edge`,
            source: node.id,
            target: formattedNodes[0].id,
          }));
          setEdges(deviceEdges);

          localStorage.setItem('cachedNodes', JSON.stringify(formattedNodes)); // Cache nodes
          setIsLoading(false); // Set loading state to false after data is fetched
        })
       .catch(error => {
          console.error('Error fetching data:', error);
          setIsLoading(false); // Set loading state to false if there's an error
        });
    }
  };

  const handleScanNetwork = () => {
    setNodes([]); // Clear nodes when "Scan Network" button is clicked
    setEdges([]); // Clear edges when "Scan Network" button is clicked
    fetch('http://localhost:5000/api/clear_cache', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(() => console.log('Cache cleared'))
      .catch(error => console.error('Error clearing cache:', error)
    )
    location.reload(); // Reload the page to clear the cache
    fetchNetworkData(); // Fetch network data when "Scan Network" button is clicked
  };

  // Function to calculate position of nodes in a circle around the center
  const calculatePosition = (index, totalDevices) => {
    const radius = 200; // Adjust radius as needed
    const angle = (Math.PI * 2) / totalDevices;
    const centerX = 0.5;
    const centerY = 0.5;
    const x = centerX + radius * Math.cos(angle * index);
    const y = centerY + radius * Math.sin(angle * index);
    return { x, y };
  };

  return (
    <div style={{ height: '100vh', backgroundColor: '#f0f0f0' }}>
      <button onClick={handleScanNetwork} disabled={isLoading}>
        {isLoading ? 'Scanning Network...' : 'Scan Network'}
      </button>
      <ReactFlow nodes={nodes} edges={edges} onLoad={() => console.log('Flow loaded')}>
        <MiniMap />
      </ReactFlow>
    </div>
  );
};

export default Dashboard;
