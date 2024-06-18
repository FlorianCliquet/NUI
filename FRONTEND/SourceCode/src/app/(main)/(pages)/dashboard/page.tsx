'use client';
import React, { useState } from 'react';
import LoadingSpinner from './components/Loading';
import NetworkGraph from './components/NetworkGraph';
import useFetchNetworkData from './hooks/useFetchNetworkData';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import FlowInstance from './components/FlowInstance';
import EditorCanvasSidebar from './components/editor-canvas-sidebar';

const Dashboard = () => {
  const { nodes, edges, isLoading: fetchLoading, fetchNetworkData, routerIP } = useFetchNetworkData();
  const [isLoading, setIsLoading] = useState(fetchLoading);

  const handleScanNetwork = async () => {
    setIsLoading(true);
    await fetch ('http://localhost:5000/api/cache_status', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    await fetch('http://localhost:5000/api/clear_cache', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    await fetchNetworkData();
    setIsLoading(false);
  };

  const handleClickCanvas = () => {
    console.log('Clicked on canvas');
  };

  return (
    <div className="flex flex-col relative">
      <h1 className="text-4xl sticky top-0 z-[10] p-6 bg-background/50 backdrop-blur-lg flex items-center border-b">
        Dashboard
      </h1>
      <div className='bg-background' style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
              <>
                <FlowInstance
                  edges={edges}
                  nodes={nodes}
                  isLoading={isLoading}
                  onScan={handleScanNetwork}
                >
                  <EditorCanvasSidebar nodes={nodes} routerIP={routerIP}/>
                </FlowInstance>
              </>
            )}
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default Dashboard;
