// RouterNodeComponent.js
import React from 'react';
import { Position } from 'react-flow-renderer';
import CustomHandle from '../components/CustomHandle';
const RouterNodeComponent = ({ data }) => {
  return (
    <>
    {data.type !== 'Trigger' && data.type !== 'Google Drive' && (
        <CustomHandle
          type="target"
          position={Position.Top}
          style={{ zIndex: 100 }}
        />
      )}
    <div style={{ width: 'fit-content', padding: 10, background: 'lightblue', border: '1px solid black', borderRadius: 5 }}>
      <strong>{data.label}</strong>
      <p>Router</p>
    </div>
    <CustomHandle
        type="target"
        position={Position.Bottom}
        id="a"
      />
    </>
  );
};


export default RouterNodeComponent;
