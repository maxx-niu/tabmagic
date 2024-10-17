import { FC, useEffect, useRef } from 'react';
import { tabImage } from '../types';
import BarBoundingBox from './BarBoundingBox';

type TabDisplayProps = {
    tabImages: tabImage[];
    onUploadAgain: () => void;
}

const TabMeasureAdjust: FC<TabDisplayProps> = ({ tabImages, onUploadAgain }) => {
    const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);

    useEffect(() => {
        tabImages.forEach((tabImage, imgIdx) => {
            const canvas = canvasRefs.current[imgIdx];
            if (canvas) {
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    // Load the image to get its dimensions
                    const img = new Image();
                    img.src = `http://localhost:5000${tabImage.image_path}`;
                    img.onload = () => {
                        canvas.width = img.width;
                        canvas.height = img.height;
                        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear any previous drawings

                        // Draw all bounding boxes
                        tabImage.bounding_boxes.flat().forEach((barBox) => {
                            const [x1, y1, x2, y2] = barBox.box;
                            ctx.strokeStyle = 'green';
                            ctx.lineWidth = 2;
                            ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
                        });
                    };
                }
            }
        });
    }, [tabImages]);

    return (
        <div>
            {tabImages.map((tabImage, imgIdx) => (
                <div key={imgIdx} style={{ position: 'relative', display: 'inline-block' }}>
                    <img 
                        src={`http://localhost:5000${tabImage.image_path}`}
                        alt='Tab Page Preview'
                        style={{ maxWidth: '100%', height: 'auto', marginBottom: '20px' }}
                    />
                    <canvas
                        ref={canvas => canvasRefs.current[imgIdx] = canvas}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            pointerEvents: 'none', // Ensure the canvas doesn't block interactions
                            zIndex: 1
                        }}
                    />
                </div>
            ))}
            <button onClick={onUploadAgain}>Upload another tab</button>
        </div>
    );
};

export default TabMeasureAdjust;

/*return (<div key={imgIdx}>
                    <img 
                        src={`http://localhost:5000${tabImage.image_path}`}
                        alt='Tab Page Preview'
                        style={{ maxWidth: '100%', height: 'auto', marginBottom: '20px' }}
                    />
                    {tabImage.bounding_boxes.flat().map((box, boxIdx) => {
                        const imageNameNoExtension = tabImage.image_name.replace(/\.png$/, '');
                        const barPath = encodeURI(`/tab_boxes/${imageNameNoExtension}_bar_${boxIdx + 1}.png`);
                        return (<div key={boxIdx} style={{ marginBottom: '10px'}}>
                            <img 
                                src={`http://localhost:5000${barPath}`}
                                alt={`Bar ${boxIdx + 1}`}
                            />
                        </div>)
                    })}
                </div>)*/
