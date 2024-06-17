import { useEditor } from '@/provider/editor-provider';
import React, { CSSProperties } from 'react';
import { Handle, HandleProps } from 'reactflow';
import { useTheme } from 'next-themes';

type Props = HandleProps & { style?: CSSProperties };

const CustomHandle = (props: Props): JSX.Element => {
  const { state } = useEditor();
  const { theme } = useTheme();

  const isDarkMode = theme === 'dark';
  const handleBackgroundColor = !isDarkMode ? '#2D2D2D' : '#FFFFFF';

  return (
    <Handle
      {...props}
      style={{ backgroundColor: handleBackgroundColor, ...props.style }}
      isValidConnection={(e) => {
        const sourcesFromHandleInState = state.editor.edges.filter(
          (edge) => edge.source === e.source
        ).length;
        const sourceNode = state.editor.elements.find(
          (node) => node.id === e.source
        );
        //target
        const targetFromHandleInState = state.editor.edges.filter(
          (edge) => edge.target === e.target
        ).length;

        if (targetFromHandleInState === 1) return false;
        if (sourcesFromHandleInState < 1) return true;
        return false;
      }}
      className="!-bottom-2 !h-4 !w-4"
    />
  );
};

export default CustomHandle;
