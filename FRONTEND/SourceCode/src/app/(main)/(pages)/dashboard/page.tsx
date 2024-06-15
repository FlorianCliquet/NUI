// page.js
'use client';
import React from 'react';
import LoadingSpinner from './components/Loading';
import { ScanButton } from './components/ScanButton';
import NetworkGraph from './components/NetworkGraph';
import useFetchNetworkData from './hooks/useFetchNetworkData';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import FlowInstance from './components/FlowInstance';
const Dashboard = () => {
  const { nodes, edges, isLoading, fetchNetworkData } = useFetchNetworkData();

  const handleClickCanvas = () => {
    console.log('Clicked on canvas');
  };

  const handleScanNetwork = async () => {
    await fetch('http://localhost:5000/api/clear_cache', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    fetchNetworkData();
    console.log(nodes);
  };

  return (
    <div className="flex flex-col relative">
      <h1 className="text-4xl sticky top-0 z-[10] p-6 bg-background/50 backdrop-blur-lg flex items-center border-b">
        Dashboard
      </h1>
      <div style={{ height: '100vh', backgroundColor: '#f0f0f0', display:'flex', flexDirection:'column', alignItems:'center' }}>
        <ScanButton isLoading={isLoading} onClick={handleScanNetwork} />
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={70}>
            <div className="flex h-full items-center justify-center">
              <div style={{ width: '100%', height: '100%', paddingBottom: '70px' }} className="relative">
                {isLoading ? (
                  <LoadingSpinner />
                ) : (
                  <NetworkGraph nodes={nodes} edges={edges} handleClickCanvas={handleClickCanvas} />
                )}
              </div>
            </div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={30} className="relative sm:block">
            {isLoading ? <LoadingSpinner /> : (
              <></>
        )}
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default Dashboard;
