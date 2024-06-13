// types/DefaultEdge.js
import React from 'react';
import { EdgeText } from 'react-flow-renderer';

const DefaultEdge = ({ sourceX, sourceY, targetX, targetY, label, animated, style = {} }) => {
    // Calculate the edge path
    const edgePath = `M ${sourceX},${sourceY} L ${targetX},${targetY}`;

    return (
        <>
            {/* Render the edge line */}
            <path
                style={{ stroke: '#000', strokeWidth: 2, ...style }}
                className={animated ? 'animated' : ''}
                d={edgePath}
            />
            {/* Render the edge label if provided */}
            {label && <EdgeText x={(sourceX + targetX) / 2} y={(sourceY + targetY) / 2} label={label} />}
        </>
    );
};

export default DefaultEdge;
