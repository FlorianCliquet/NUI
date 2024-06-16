import React from 'react';
import { Position } from 'react-flow-renderer';
import { useTheme } from 'next-themes';
import CustomHandle from '../components/CustomHandle';

const DeviceNodeComponent = ({ data, xPos, yPos }) => {
  const { theme } = useTheme();

  const isDarkMode = theme === 'dark';
  const borderColor = isDarkMode ? 'white' : 'black';
  const backgroundColor = isDarkMode ? 'darkblue' : 'lightblue';

  const routerX = 500;
  const routerY = 200;
  const tolerance = 50;

  let handlePosition = Position.Right;
  if (yPos > routerY + tolerance) {
    handlePosition = Position.Top;
  } else if (yPos < routerY - tolerance) {
    handlePosition = Position.Bottom;
  } else if (xPos > routerX + tolerance) {
    handlePosition = Position.Left;
  } else if (xPos < routerX - tolerance) {
    handlePosition = Position.Right;
  }

  return (
    <>
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
        <p>Device</p>
      </div>
      <CustomHandle
        type="target"
        position={handlePosition}
        id={`${data.label}-source`}
      />
    </>
  );
};

export default DeviceNodeComponent;
