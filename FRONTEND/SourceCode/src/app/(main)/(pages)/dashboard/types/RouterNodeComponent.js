import React from 'react';
import { Position } from 'react-flow-renderer';
import { useTheme } from 'next-themes';
import CustomHandle from '../components/CustomHandle';

const RouterNodeComponent = ({ data }) => {
  const { theme } = useTheme();

  const isDarkMode = theme === 'dark';
  const borderColor = isDarkMode ? 'white' : 'black';
  const backgroundColor = isDarkMode ? 'darkblue' : 'lightblue';

  return (
    <>
      {data.type !== 'Trigger' && (
        <CustomHandle
          type="source"
          position={Position.Top}
          id="top"
        />
      )}
      <div
        style={{
          width: 'fit-content',
          padding: 10,
          backgroundColor: backgroundColor,
          border: `1px solid ${borderColor}`,
          borderRadius: 5,
        }}
      >
        <strong>{data.label}</strong>
        <p>Router</p>
      </div>
      <CustomHandle type="source" position={Position.Right} id="right" />
      <CustomHandle type="source" position={Position.Left} id="left" />
      <CustomHandle type="source" position={Position.Bottom} id="bottom" />
    </>
  );
};

export default RouterNodeComponent;
