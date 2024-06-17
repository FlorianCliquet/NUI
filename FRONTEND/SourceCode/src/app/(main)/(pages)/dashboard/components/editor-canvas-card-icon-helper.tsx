'use client'
import React from 'react';
import { Router, MonitorSmartphone , Zap} from 'lucide-react';
import { EditorCanvasTypes } from '@/lib/types'

type Props = { type: EditorCanvasTypes }

const EditorCanvasIconHelper = ({ type }: Props) => {
  switch (type) {
    case 'Router':
      return (
        <Router
          className="flex-shrink-0"
          size={30}
        />
      )
    case 'Device':
      return (
        <MonitorSmartphone
          className="flex-shrink-0"
          size={30}
        />
      )
    default:
      return (
        <Zap
          className="flex-shrink-0"
          size={30}
        />
      )
  }
}

export default EditorCanvasIconHelper