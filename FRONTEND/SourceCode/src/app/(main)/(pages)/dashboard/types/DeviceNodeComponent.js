import React from 'react';
import { Position } from 'react-flow-renderer';
import CustomHandle from '../components/CustomHandle';

const DeviceNodeComponent = ({ data, xPos, yPos }) => {
  const routerX = 500; // Example router x position
  const routerY = 200; // Example router y position

  // Determine the position of the trigger handle based on device node's position relative to router
  let triggerHandlePosition = null;
  if (true) {
    if (xPos > routerX && yPos > routerY) {
      triggerHandlePosition = Position.BottomRight;
    } else if (xPos < routerX && yPos > routerY) {
      triggerHandlePosition = Position.BottomLeft;
    } else if (xPos > routerX && yPos < routerY) {
      triggerHandlePosition = Position.TopRight;
    } else if (xPos < routerX && yPos < routerY) {
      triggerHandlePosition = Position.TopLeft;
    }
  }

  return (
    <>
      <div style={{ width: 'fit-content', padding: 10, background: 'lightblue', border: '1px solid black', borderRadius: 5 }}>
        <strong>{data.label}</strong>
        <p>Device</p>
      </div>
      {triggerHandlePosition && (
        <CustomHandle
          type="source"
          position={triggerHandlePosition}
          id="a"
        />
      )}
    </>
  );
};

export default DeviceNodeComponent;
