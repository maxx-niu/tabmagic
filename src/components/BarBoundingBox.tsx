import { FC, useState, useEffect } from 'react';
import { Rnd } from 'react-rnd';
import '../styles/BarBoundingBoxes.css';

type BoundingBoxProps = {
    box: number[];
    imageWidth: number;
    imageHeight: number;
    onDelete: () => void;
    flash?: boolean;
}

const BarBoundingBox: FC<BoundingBoxProps> = ({ box, imageWidth, imageHeight, onDelete, flash }) => {
    const [boxState, setBoxState] = useState<{
        left: number;
        top: number;
        width: number;
        height: number;
        resizeDirection: string | null;
    }>({
        left: (box[0] / imageWidth) * 100,
        top: (box[1] / imageHeight) * 100,
        width: ((box[2] - box[0]) / imageWidth) * 100,
        height: ((box[3] - box[1]) / imageHeight) * 100,
        resizeDirection: null
    });

    useEffect(() => {
        if (flash) {
            const timer = setTimeout(() => {
                setBoxState((prev) => ({ ...prev, resizeDirection: null }));
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    return (
        <Rnd
            className={flash ? 'flash' : ''}
            style={{
                border: "solid 2px green"
            }}
            size={{
                width: `${boxState.width}%`,
                height: `${boxState.height}%`,
            }}
            position={{
                x: (boxState.left / 100) * imageWidth, 
                y: (boxState.top / 100) * imageHeight
            }}
            onDragStop={(e, d) => {
                setBoxState((prevBoxState) => ({...prevBoxState, left: (d.x / imageWidth) * 100,
                    top: (d.y / imageHeight) * 100 }));
            }}
            onResizeStop={(e, direction, ref, delta, position) => {
                setBoxState((prevBoxState) => ({
                    ...prevBoxState,
                    width: parseFloat(ref.style.width),
                    height: parseFloat(ref.style.height),
                    left: (position.x / imageWidth) * 100,
                    top: (position.y / imageHeight) * 100
                }));
            }}
            bounds="parent"
        >
            <button 
                onClick={onDelete} 
                style={{ 
                    position: 'absolute', 
                    top: 0, 
                    right: 0,
                    background: 'transparent',
                    border: 'none',
                    color: 'rgba(128, 128, 128, 0.5)',
                    fontSize: '16px',
                    cursor: 'pointer',
                    transition: 'color 0.3s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255, 0, 0, 1)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(128, 128, 128, 0.5)'}
            >
                X
            </button>
        </Rnd>
    );
}

export default BarBoundingBox;
