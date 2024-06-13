'use client'
import { Button } from '@/components/ui/button'
import { usePathname } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'

type Props = {
  children: React.ReactNode
  edges: any[]
  nodes: any[]
}

const FlowInstance = ({ children, edges, nodes }: Props) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-3 p-4">
        <Button
        >
          Save
        </Button>
        <Button
        >
          Publish
        </Button>
      </div>
      {children}
    </div>
  )
}

export default FlowInstance