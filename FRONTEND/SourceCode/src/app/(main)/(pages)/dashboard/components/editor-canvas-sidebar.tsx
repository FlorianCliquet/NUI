'use client'
import { EditorCanvasTypes, EditorNodeType } from '@/lib/types'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import React, { useEffect } from 'react'
import { Separator } from '@/components/ui/separator'
import { EditorCanvasDefaultCardTypes } from '@/lib/constant'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import EditorCanvasIconHelper from './editor-canvas-card-icon-helper'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

type Props = {
  nodes: EditorNodeType[]
  routerIP: string | null
}

const EditorCanvasSidebar = ({ nodes , routerIP}: Props) => {
  return (
    <aside>
      <Tabs
        defaultValue="summary"
        className="h-screen overflow-scroll pb-24"
      >
        <TabsList className="bg-transparent">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="action">Actions</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <Separator />
        <TabsContent
          value="summary"
          className="flex flex-col gap-4 p-4"
        >
          {Object.entries(EditorCanvasDefaultCardTypes)
            .filter(
              ([_, cardType]) =>
                (!nodes.length && cardType.type === 'Action') ||
                (nodes.length && cardType.type === 'Summary')
            )
            .map(([cardKey, cardValue]) => (
              <Card
                key={cardKey}
                draggable
                className="w-full cursor-grab border-black bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900"
              >
                <CardHeader className="flex flex-row items-center gap-4 p-4">
                  <EditorCanvasIconHelper type={cardKey as EditorCanvasTypes} />
                  <CardTitle className="text-md">
                    {cardKey}
                    <CardDescription>{cardValue.description}</CardDescription>
                  </CardTitle>
                </CardHeader>
              </Card>
            ))}
            <Accordion type="multiple">
                <AccordionItem
                value="Options"
                className="border-y-[1px] px-2"
                >
                <AccordionTrigger className="!no-underline">
                    Router
                </AccordionTrigger>
                <AccordionContent>
                {nodes
                    .filter(node => node.id === routerIP)
                    .map((node, index) => (
                        <Card key={index} className="w-full cursor-grab border-black bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900">
                            <CardHeader className='flex flex-row items-center gap-4 p-4'>
                                <EditorCanvasIconHelper type={'Router' as EditorCanvasTypes} />
                                <CardTitle className='text-md'>
                                    {node.data.label}
                                    <CardDescription>{node.id}</CardDescription>
                                </CardTitle>
                            </CardHeader>
                        </Card>
                    ))}
                </AccordionContent>
                </AccordionItem>
                <AccordionItem
                value="Expected Output"
                className="px-2"
                >
                <AccordionTrigger className="!no-underline">
                    Device
                </AccordionTrigger>
                <AccordionContent>
                {nodes
                    .filter(node => node.id !== routerIP)
                    .map((node, index) => (
                        <Card key={index} className="w-full cursor-grab border-black bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900">
                            <CardHeader className='flex flex-row items-center gap-4 p-4'>
                                <EditorCanvasIconHelper type={'Device' as EditorCanvasTypes} />
                                <CardTitle className='text-md'>
                                    {node.data.label}
                                    <CardDescription>{node.id}</CardDescription>
                                </CardTitle>
                            </CardHeader>
                        </Card>
                    ))}
                </AccordionContent>
                </AccordionItem>
            </Accordion>
        </TabsContent>
        <TabsContent
          value="action"
          className="-mt-6"
        >
          {Object.entries(EditorCanvasDefaultCardTypes)
            .filter(
              ([_, cardType]) =>
                (!nodes.length && cardType.type === 'Summary') ||
                (nodes.length && cardType.type === 'Action')
            )
            .map(([cardKey, cardValue]) => (
              <Card
                key={cardKey}
                draggable
                className="w-full cursor-grab border-black bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900"
              >
                <CardHeader className="flex flex-row items-center gap-4 p-4">
                  <EditorCanvasIconHelper type={cardKey as EditorCanvasTypes} />
                  <CardTitle className="text-md">
                    {cardKey}
                    <CardDescription>{cardValue.description}</CardDescription>
                  </CardTitle>
                </CardHeader>
              </Card>
            ))}
        </TabsContent>
        <TabsContent
          value="settings"
          className="-mt-6"
        >
          <div className="px-2 py-4 text-center text-xl font-bold">
          </div>

          <Accordion type="multiple">
            <AccordionItem
              value="Options"
              className="border-y-[1px] px-2"
            >
              <AccordionTrigger className="!no-underline">
                Account
              </AccordionTrigger>
              <AccordionContent>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem
              value="Expected Output"
              className="px-2"
            >
              <AccordionTrigger className="!no-underline">
                Action
              </AccordionTrigger>

            </AccordionItem>
          </Accordion>
        </TabsContent>
      </Tabs>
    </aside>
  )
}

export default EditorCanvasSidebar