import React, { FC, useState } from 'react';
import Draggable from 'react-draggable';

type BoundingBoxProps = {
    box: number[];
    imageWidth: number;
    imageHeight: number;
    onUpdate: (newBox: number[]) => void;
    onDelete: () => void;
}

const BarBoundingBox: FC<BoundingBoxProps> = ({ box, imageWidth, imageHeight, onUpdate, onDelete }) => {
    const [position, setPosition] = useState({
        x: (box[0] / imageWidth) * 100,
        y: (box[1] / imageHeight) * 100
    });
    const [size, setSize] = useState({
        width: ((box[2] - box[0]) / imageWidth) * 100,
        height: ((box[3] - box[1]) / imageHeight) * 100
    });

    const handleDrag = (e: any, data: any) => {
        const newX = (data.x / imageWidth) * 100;
        const newY = (data.y / imageHeight) * 100;
        setPosition({ x: newX, y: newY });
        onUpdate([
            (newX / 100) * imageWidth,
            (newY / 100) * imageHeight,
            ((newX + size.width) / 100) * imageWidth,
            ((newY + size.height) / 100) * imageHeight
        ]);
    };

    return (
        <Draggable position={{ x: (position.x / 100) * imageWidth, y: (position.y / 100) * imageHeight }} onDrag={handleDrag}>
            <div
                style={{
                    position: 'absolute',
                    transform: `translate(${position.x}%, ${position.y}%)`,
                    border: '2px solid green',
                    width: `${size.width}%`,
                    height: `${size.height}%`,
                    cursor: 'move',
                }}
            >
                <button onClick={onDelete} style={{ position: 'absolute', top: 0, right: 0 }}>X</button>
            </div>
        </Draggable>
    );
}

export default BarBoundingBox;