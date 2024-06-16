import React from 'react';
import { EdgeText } from 'react-flow-renderer';
import { useTheme } from 'next-themes';

const DefaultEdge = ({ sourceX, sourceY, targetX, targetY, label, animated, style = {} }) => {
    const { theme } = useTheme();

    const isDarkMode = theme === 'dark';
    const strokeColor = isDarkMode ? 'white' : 'black';

    // Calculate the edge path
    const edgePath = `M ${sourceX},${sourceY} L ${targetX},${targetY}`;

    return (
        <>
            <path
                style={{ stroke: strokeColor, strokeWidth: 2, ...style }}
                className={animated ? 'animated' : ''}
                d={edgePath}
            />
            {label && <EdgeText x={(sourceX + targetX) / 2} y={(sourceY + targetY) / 2} label={label} />}
        </>
    );
};

export default DefaultEdge;
