import React, { FC } from 'react';
import { ProcessedImage } from '../types';

type TabDisplayProps = {
    processedImages: ProcessedImage[];
}

const TabDisplay: FC<TabDisplayProps> = ({processedImages}) => {
    // for (const processedImage of processedImages){
    //     console.log(processedImage)
    // }

    return (
        <div>
            {processedImages.map((processedImage, imgIdx) => (
                <div key={imgIdx}>
                    <img 
                        src={`http://localhost:5000${processedImage.image_path}`}
                        alt='churg'
                        style={{ maxWidth: '100%', height: 'auto', marginBottom: '20px' }}
                    />
                    {processedImage.bounding_boxes.flat().map((box, boxIdx) => (
                        <div key={boxIdx} style={{ marginBottom: '10px' }}>
                            <img 
                                src={`http://localhost:5000${processedImage.image_path}`}
                                alt={`Bar ${boxIdx + 1}`}
                                style={{
                                    clipPath: `polygon(${box['box'][0]}px ${box['box'][1]}px, ${box['box'][2]}px ${box['box'][1]}px,
                                    ${box['box'][2]}px ${box['box'][3]}px, ${box['box'][0]}px ${box['box'][3]}px)`,
                                    maxWidth: `${box['box'][2] - box['box'][0]}`,
                                }}
                            />
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default TabDisplay;