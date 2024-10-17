import React, { FC, useState } from 'react';
import Draggable from 'react-draggable';

type BoundingBoxProps = {
    box: number[];
    onUpdate: (newBox: number[]) => void;
    onDelete: () => void;
}

const BarBoundingBox: FC<BoundingBoxProps> = ({box, onUpdate, onDelete}) => {
  const [position, setPosition] = useState({ x: box[0], y: box[1] });
  const [size, setSize] = useState({ width: box[2] - box[0], height: box[3] - box[1] });

    const handleDrag = (e: any, data: any) => {
        setPosition({ x: data.x, y: data.y });
        onUpdate([data.x, data.y, data.x + size.width, data.y + size.height]);
    };

    const handleResize = (e: React.MouseEvent, direction: string) => {
        // Implement resizing logic here
    };

    return (
        <Draggable position={position} onDrag={handleDrag}>
            <div
                style={{
                    position: 'absolute',
                    border: '2px solid green',
                    width: size.width,
                    height: size.height,
                    cursor: 'move',
                }}
            >
                <button onClick={onDelete} style={{ position: 'absolute', top: 0, right: 0 }}>X</button>
                {/* Add resize handles and logic here */}
            </div>
        </Draggable>
    );
}

export default BarBoundingBox;