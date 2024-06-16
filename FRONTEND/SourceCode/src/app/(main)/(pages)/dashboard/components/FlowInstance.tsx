'use client'
import ScanButton from './ScanButton'
import useFetchNetworkData from './../hooks/useFetchNetworkData'
import React, { useCallback, useEffect, useState } from 'react'

type Props = {
  children: React.ReactNode
  edges: any[]
  nodes: any[]
}

const FlowInstance = ({ children, edges, nodes }: Props) => {
  const { isLoading,fetchNetworkData } = useFetchNetworkData();
  const handleScanNetwork = async () => {
    await fetch('http://localhost:5000/api/clear_cache', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    fetchNetworkData();
    console.log(nodes);
    console.log("edges",edges);
  };
  return (
    <div className="flex flex-col gap-2">
      <ScanButton isLoading={isLoading} onClick={handleScanNetwork} />
      </div>
  )
}

export default FlowInstance