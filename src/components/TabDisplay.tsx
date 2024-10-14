import React, { FC, useEffect, useRef } from 'react';
import { tabImage } from '../types';

type TabDisplayProps = {
    tabImages: tabImage[];
    onUploadAgain: () => void;
}

const TabDisplay: FC<TabDisplayProps> = ({tabImages, onUploadAgain}) => {
    const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);

    useEffect(() => {
        tabImages.forEach((tabImage) => {
            tabImage.bounding_boxes.flat().forEach((barBox, boxIdx) => {
                const canvas = canvasRefs.current[boxIdx];
                if (canvas) {
                    const ctx = canvas.getContext('2d');
                    if (ctx) {
                        const barImg = new Image();
                        const imageNameNoExtension = tabImage.image_name.replace(/\.png$/, '');
                        const barPath = encodeURI(`/tab_boxes/${imageNameNoExtension}_bar_${boxIdx + 1}.png`);
                        barImg.src = `http://localhost:5000${barPath}`;
                        // draw the image when it is loaded
                        barImg.onload = () => {
                            canvas.width = barImg.width;
                            canvas.height = barImg.height;
                            ctx.drawImage(barImg, 0, 0, canvas.width, canvas.height);
                            barBox.fret_strings.forEach((fretString) => {
                                if (fretString.label === 'number') {
                                    ctx.strokeStyle = 'black';
                                    const [x1, y1, x2, y2] = fretString.box;
                                    ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
                                }
                                else {
                                    ctx.strokeStyle = 'red';
                                    const [x1, y1, x2, y2] = fretString.box;
                                    ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
                                }
                            })
                        };
                        barImg.onerror = () => {
                            console.error(`Failed to load image at ${barImg.src}`);
                        };
                    }
                }
            });    
        });
    }, [tabImages]);

    return (
        <div>
            {tabImages.map((tabImage, imgIdx) => {
                console.log(tabImage);
                return(
                    <div key={imgIdx}>
                        <img 
                            src={`http://localhost:5000${tabImage.image_path}`}
                            alt='Tab Page Preview'
                            style={{ maxWidth: '100%', height: 'auto', marginBottom: '20px' }}
                        />
                        {tabImage.bounding_boxes.flat().map((box, boxIdx) => {
                            return (
                                <div key={boxIdx} style={{ marginBottom: '10px'}}>
                                    <canvas
                                        key={boxIdx} 
                                        ref={canvas => canvasRefs.current[boxIdx] = canvas}
                                    >
                                    </canvas>
                                    <p>Filename: {box.filename}</p>
                                </div>
                            )
                        })}
                    </div>
                )
            })}
            <button onClick={onUploadAgain}>Upload another tab</button>
        </div>
    );
};

export default TabDisplay;

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